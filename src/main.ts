import { VersioningType, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogsInterceptor } from './shared/logs.interceptor';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('ChildCare CRM Api Project')
    .setDescription('An Api Project with NestJs, PostgresSQL, TypeORM')
    .setVersion('1.0')
    .build();

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix(process.env.API_PREFIX || 'api');
  app.useGlobalInterceptors(new LogsInterceptor());

  app.useGlobalPipes(new ValidationPipe());
  const document = SwaggerModule.createDocument(app, config);
  const swagger_options = {
    customCss: '.swagger-ui .topbar { display: none }',
  };
  app.enableCors({ origin: true, credentials: true });

  SwaggerModule.setup('/', app, document, swagger_options); // swagger_options

  await app.listen(process.env.PORT || 3007, '0.0.0.0', async () => {
    console.log(`Listening on : ${await app.getUrl()}`);
  });
}
bootstrap();
