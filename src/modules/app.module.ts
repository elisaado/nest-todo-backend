import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { LocalAuthGuard } from './auth/local-auth.guard';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      tracing: true,
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthModule, LocalAuthGuard],
})
export class AppModule {}
