import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { RoleModule } from './api/role/role.module';
import { AuthModule } from './api/auth/auth.module';
import { IntakeModule } from './api/intake/intake.module';
import { ServiceCoordinatorModule } from './api/service-coordinator/service-coordinator.module';
import { TransitionPlanModule } from './api/transition-plan/transition-plan.module';
import { ExitPlanModule } from './api/exit-plan/exit-plan.module';
import { ManageChildModule } from './api/manage-child/manage-child.module';
import { ConversationTypeModule } from './api/conversation-type/conversation-type.module';

const production = false; // fasle : development env and true : production env

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !production ? '.env.development' : '.env.production',
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_DIALECT || ('postgres' as any),
      host: process.env.DB_HOST || '103.148.157.214',
      port: parseInt(<string>process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'admin@123',
      database: process.env.DB_NAME || 'devChildCareCRM',
      entities: [join(__dirname, '**', '*.{ts,js}')], // don't remove this line
      synchronize: !production ? false : false,
      // 1st one is for development and 2nd one is for production
      // only when migration needed then call it to true
      logging: false,
    }),
    SharedModule,
    RoleModule,
    AuthModule,
    IntakeModule,
    ServiceCoordinatorModule,
    TransitionPlanModule,
    ExitPlanModule,
    ManageChildModule,
    ConversationTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
