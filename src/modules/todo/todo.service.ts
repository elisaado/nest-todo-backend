import { Injectable } from '@nestjs/common';
import { Todo } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async get(id: number): Promise<Todo> {
    return await this.prisma.todo.findUnique({ where: { id } });
  }

  async getAllOfUser(id: number): Promise<Todo[]> {
    return await this.prisma.todo.findMany({ where: { userId: id } });
  }

  async create({ title, content, user }) {
    const todo = await this.prisma.todo.create({
      data: { title, content, userId: user.id },
    });

    return todo;
  }

  async setDone(id: number, done: boolean) {
    const todo = this.prisma.todo.update({ where: { id }, data: { done } });
    return todo;
  }
}
