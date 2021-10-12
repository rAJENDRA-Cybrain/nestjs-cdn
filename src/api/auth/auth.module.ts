import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  AdditionalChildrenEntity,
  IntakeEntity,
  RoleEntity,
  UserEntity,
  SmtpDetailEntity,
} from '../../database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from '../role/role.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { IntakeService } from '../intake/intake.service';
import { SmtpDetailsService } from '../smtp-details/smtp-details.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      IntakeEntity,
      AdditionalChildrenEntity,
      SmtpDetailEntity,
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RoleService,
    IntakeService,
    JwtStrategy,
    SmtpDetailsService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
