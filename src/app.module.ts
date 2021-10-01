/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SharedModule } from './shared/shared.module';
import { RoleModule } from './api/role/role.module';
import { AuthModule } from './api/auth/auth.module';
import { IntakeModule } from './api/intake/intake.module';
import { ServiceCoordinatorModule } from './api/service-coordinator/service-coordinator.module';
import { TransitionPlanModule } from './api/transition-plan/transition-plan.module';
import { ExitPlanModule } from './api/exit-plan/exit-plan.module';
import { ManageChildModule } from './api/manage-child/manage-child.module';
import { ConversationTypeModule } from './api/conversation-type/conversation-type.module';
import { SmtpDetailsModule } from './api/smtp-details/smtp-details.module';
import { RecordConversationModule } from './api/record-conversation/record-conversation.module';
import { ReportsModule } from './api/reports/reports.module';
import { EmailTemplateModule } from './api/email-template/email-template.module';

const production = false; // fasle : development env and true : production env

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !production ? '.env.development' : '.env.production',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-44-198-204-136.compute-1.amazonaws.com',
      database: 'dbmn4ctprpvs8j',
      port:  5432,
      username: 'hgjvwxrrerpbof',
      password:'faaa99952d7564be2178988181ce83287423cf3214c8ff0722ba81a1f63d9073',
      ssl: { rejectUnauthorized: false },
      entities: [join(__dirname, '**', '*.{ts,js}')], // don't remove this line
      synchronize: !production ? true : false,
      // 1st one is for development and 2nd one is for production
      // only when migration needed then call it to true
      logging: false,
    }),
    ServeStaticModule.forRoot(
      {
        rootPath: join(__dirname, '..', 'webroot'),
        serveRoot: '/uploads',
      },
      {
        rootPath: join(__dirname, '..', 'webroot/html-to-pdf'),
        serveRoot: '/html-to-pdf',
      },
    ),
    SharedModule,
    RoleModule,
    AuthModule,
    IntakeModule,
    ServiceCoordinatorModule,
    TransitionPlanModule,
    ExitPlanModule,
    ManageChildModule,
    ConversationTypeModule,
    SmtpDetailsModule,
    RecordConversationModule,
    ReportsModule,
    EmailTemplateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
