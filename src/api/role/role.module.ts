import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity, UserEntity } from '../../database';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleEntity, UserEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
