import { VersioningType, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogsInterceptor } from './shared/logs.interceptor';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

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
    .build();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // app.use(
  //   cors({
  //     origin: ['http://localhost:4200', 'https://crm.cybraintech.com'],
  //     allowedHeaders:
  //       'Origin,X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe,Authorization,authorization',
  //     methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  //     credentials: true,
  //   }),
  // );

  app.setGlobalPrefix(process.env.API_PREFIX || 'api');
  app.useGlobalInterceptors(new LogsInterceptor());

  app.useGlobalPipes(new ValidationPipe());
  const document = SwaggerModule.createDocument(app, config);
  const swagger_options = {
    customCss: '.swagger-ui .topbar { display: none }',
  };

  //const whitelist = ['http://localhost:4567', 'http://crm.cybraintech.com/'];
  // app.enableCors({
  //   origin: function (origin, callback) {
  //     if (whitelist.indexOf(origin) !== -1) {
  //       console.log('allowed cors for:', origin);
  //       callback(null, true);
  //     } else {
  //       console.log('blocked cors for:', origin);
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   // allowedHeaders:
  //   //   'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe,Authorization,authorization,Access-Control-Allow-Origin',
  //   // methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  //   credentials: true,
  // });

  app.enableCors({ origin: true, credentials: true });

  SwaggerModule.setup('/', app, document, swagger_options); // swagger_options

  await app.listen(process.env.PORT || 3007, '0.0.0.0', async () => {
    console.log(`Listening on : ${await app.getUrl()}`);
  });
}
bootstrap();
