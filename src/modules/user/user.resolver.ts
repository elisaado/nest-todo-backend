import {
  Resolver,
  Query,
  Args,
  ResolveField,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { User } from 'src/models/user.model';
import { UserService } from './user.service';
import { TodoService } from '../todo/todo.service';
import { Todo } from 'src/models/todo.model';
import { UseGuards } from '@nestjs/common';
import { GqlJWTAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from 'src/decorators/user-decorator';

@Resolver((of) => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private todoService: TodoService,
  ) {}

  @Query((returns) => User)
  @UseGuards(GqlJWTAuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }

  @ResolveField('todos', (returns) => [Todo])
  async todos(@Parent() user: User) {
    const { id } = user;
    const todos = await this.todoService.getAllOfUser(id);
    if (!todos) throw new Error('No todos found');
    return todos;
  }

  @Mutation((returns) => User)
  async createUser(
    @Args('name') name: string,
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return await this.userService.create(email, name, password);
  }
}
