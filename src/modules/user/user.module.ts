import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TodoModule } from '../todo/todo.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, TodoModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
