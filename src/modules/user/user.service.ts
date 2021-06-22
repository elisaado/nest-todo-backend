import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcrypt';
import * as nodemailer from 'nodemailer';
import * as config from '../../../config.json';

const saltRounds = 10;

@Injectable()
export class UserService {
  mailer: nodemailer.Transporter;
  constructor(private prisma: PrismaService) {
    this.mailer = nodemailer.createTransport(config.email);
  }

  async findById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async create(email: string, name: string, password: string) {
    if (
      !email.match(
        /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
      )
    )
      throw new BadRequestException('Bad email');

    const verificationCode = Math.random().toString().slice(2, 7);
    const user = await this.prisma.user
      .create({
        data: {
          email,
          name,
          password: await hash(password, saltRounds),
          verificationCode,
        },
      })
      .catch((e) => {
        if (e.code === 'P2002') {
          throw new HttpException(
            'a new user cannot be created with this email',
            400,
          );
        }
      });
    if (!user) {
      throw new HttpException('Internal server error', 500);
    }

    await this.mailer
      .sendMail({
        from: `"Todo email verification service" <${config.email.auth.user}>`,
        to: email,
        subject: `Todo email verification (${verificationCode})`,
        text: `Your verification code is: ${verificationCode}`,
        html: `Your verification code is: <b>${verificationCode}</b>`,
      })
      .catch(() => {
        this.prisma.user.delete({ where: { id: user.id } });
        throw new HttpException('Internal server error', 500);
      });
    return user;
  }

  async verify(code: string, userId: number): Promise<boolean> {
    const user = await this.findById(userId); // cannot use User as argument because of conflicting graphql/prisma model
    if (user.verified) return false;

    if (code !== user.verificationCode) return false;

    return this.prisma.user
      .update({
        where: { id: user.id },
        data: { verified: true, verificationCode: '' },
      })
      .then(() => true)
      .catch(() => false);
  }
}
