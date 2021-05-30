import { ExceptionFilter, HttpException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError) {
    if (exception.code === 'P2002') {
      console.log(
        'There is a unique constraint violation, a new user cannot be created with this email',
      );

      throw new HttpException(
        'a new user cannot be created with this email',
        400,
      );
    }
  }
}
