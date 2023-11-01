import { NestFactory } from '@nestjs/core';

import { NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as cors from 'cors';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors());
  app.enableCors();
  app.setGlobalPrefix('api');
  // Add Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ORBIT Backend API')
    .setDescription('Backend API supported by Swagger')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig, options);
  SwaggerModule.setup('docs', app, document);
  const config = new ConfigService();
  await app.listen(await config.getPortConfig());
}
bootstrap();
