import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { AppModule } from './app.module';
import type {
  CorsConfig,
  NestConfig,
} from 'src/common/configs/config.interface';
import { BadRequestException } from '@nestjs/common/exceptions';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  app.use(json({ limit: '8mb' }));

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const keys = Object.keys(errors[0].constraints);
        if (keys.length) {
          return new BadRequestException(errors[0].constraints[keys[0]]);
        }
      },
    })
  );

  // enable shutdown hook
  const prismaService: PrismaService = app.get(PrismaService);
  prismaService.enableShutdownHooks(app);

  // Prisma Client Exception Filter for unhandled exceptions
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');

  // Cors
  if (corsConfig.enabled) {
    app.enableCors();
  }

  await app.listen(process.env.PORT || nestConfig.port || 3000);
  logger.log(
    `Application listening on port http://localhost:${
      process.env.PORT || nestConfig.port || 3000
    }/graphql`
  );
}
bootstrap();
