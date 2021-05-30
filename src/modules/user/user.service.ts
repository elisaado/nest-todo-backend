import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcrypt';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async create(email: string, name: string, password: string) {
    const user = await this.prisma.user.create({
      data: { email, name, password: await hash(password, saltRounds) },
    });

    return user;
  }
}
