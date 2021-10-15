/* eslint-disable prettier/prettier */
import { VersioningType, ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogsInterceptor } from './shared/logs.interceptor';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
//import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(
    bodyParser.urlencoded({
      limit: '50mb',
      extended: true,
      parameterLimit: 50000,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('ChildCare CRM Api Project')
    .setDescription('An Api Project with NestJs, PostgresSQL, TypeORM')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix(process.env.API_PREFIX || 'api');
  app.useGlobalInterceptors(new LogsInterceptor());

  app.useGlobalPipes(new ValidationPipe());
  const document = SwaggerModule.createDocument(app, config);

  // const whitelist = ['http://localhost:4567'];
  // app.enableCors({
  //   origin: function (origin, callback) {
  //     if (whitelist.indexOf(origin) !== -1) {
  //       //console.log('allowed cors for:', origin);
  //       callback(null, true);
  //     } else {
  //       //console.log('blocked cors for:', origin);
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   allowedHeaders:
  //     'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe,Authorization,authorization',
  //   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  //   credentials: true,
  // });

  app.enableCors({
      origin: true,
      credentials: true 
  });

  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT || 3007, '0.0.0.0', async () => {
    console.log(`Listening on : ${await app.getUrl()}`);
  });
}
bootstrap();
