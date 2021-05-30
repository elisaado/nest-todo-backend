import { NestFactory } from '@nestjs/core';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new PrismaExceptionFilter());
  await app.listen(3000);
}
bootstrap();
