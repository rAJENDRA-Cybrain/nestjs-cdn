import { VersioningType, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogsInterceptor } from './shared/logs.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  //console.log(JSON.stringify(document));
  // const swagger_options = {
  //   customCss: '.swagger-ui .topbar { display: none }',
  // };
  app.enableCors({
    origin: ['http://localhost:4600'],
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Origin',
    methods: 'GET,PUT,POST,DELETE,UPDATE,OPTIONS',
  });

  SwaggerModule.setup('/', app, document); // swagger_options

  await app.listen(process.env.SERVER_PORT || 3007, async () => {
    console.log(`Listening on : ${await app.getUrl()}`);
  });
}
bootstrap();
