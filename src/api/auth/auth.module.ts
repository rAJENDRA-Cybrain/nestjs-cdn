import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RoleEntity, UserEntity } from '../../database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from '../role/role.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { IntakeModule } from '../intake/intake.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    PassportModule,
    JwtModule.register({
      secret: 'JWT_SECRET',
      signOptions: { expiresIn: '7d' },
    }),
    //forwardRef(() => IntakeModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, RoleService],
  exports: [AuthService],
})
export class AuthModule {}
