import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { GlobalExceptionFilter } from 'src/error/global-exception.filter';
import { DuplicateExceptionFilter } from 'src/error/duplicate-exception.filter';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from 'src/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: configService.isProduction(),
    }),
  );
  setupGlobalFilters(app);
  setupSwagger(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(
    `Running in ${configService.isProduction() ? 'prod' : 'dev'} mode on port ${port}`,
  );
}

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Notes API (Speer)')
    .setDescription('API for Notes')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

export function setupGlobalFilters(app: INestApplication): void {
  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new DuplicateExceptionFilter(),
  );
}

bootstrap();
