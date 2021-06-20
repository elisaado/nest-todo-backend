import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/decorators/user-decorator';
import { Todo } from 'src/models/todo.model';
import { User } from 'src/models/user.model';
import { GqlJWTAuthGuard } from '../auth/jwt.guard';
import { TodoService } from './todo.service';

@Resolver((of) => Todo)
export class TodoResolver {
  constructor(private todoService: TodoService) {}

  @Mutation((returns) => Todo)
  @UseGuards(GqlJWTAuthGuard)
  async createTodo(
    @CurrentUser() user: User,
    @Args({ name: 'title' }) title: string,
    @Args({ name: 'content' }) content: string,
  ) {
    if (!user.verified) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Email not verified',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return await this.todoService.create({ title, content, user });
  }

  @Mutation((returns) => Todo)
  @UseGuards(GqlJWTAuthGuard)
  async markDone(
    @CurrentUser() user: User,
    @Args({ name: 'id' }) id: number,
    @Args({ name: 'done' }) done: boolean,
  ) {
    return await this.todoService.setDone(id, done);
  }
}
