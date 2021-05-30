import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';

@Module({
  imports: [PrismaModule],
  providers: [TodoResolver, TodoService],
  exports: [TodoService],
})
export class TodoModule {}
