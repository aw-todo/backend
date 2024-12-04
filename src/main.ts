import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const options = new DocumentBuilder()
    .setTitle('todo service backend')
    .setDescription('구현해라 프론트.')
    .setVersion('1.0')
    .addServer('http://localhost:4000/', 'Local environment')
    .addTag('Plan 관련 API')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 4000);
}

bootstrap();
