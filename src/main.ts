import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors();
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      validateCustomDecorators: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ShoesMark Api')
    .setDescription('Sẽ cập nhật description')
    .setVersion('1.0.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  await app.listen(3000);
}
bootstrap();
