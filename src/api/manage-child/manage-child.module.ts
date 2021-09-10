import { forwardRef, Module } from '@nestjs/common';
import { ManageChildService } from './manage-child.service';
import { ManageChildController } from './manage-child.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ConversationTypeEntity,
  IntakeEntity,
  ManageChildNotesEntity,
  UserEntity,
} from 'src/database';
import { IntakeService } from '../intake/intake.service';
import { ConversationTypeService } from '../conversation-type/conversation-type.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      IntakeEntity,
      ConversationTypeEntity,
      ManageChildNotesEntity,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ManageChildController],
  providers: [ManageChildService, IntakeService, ConversationTypeService],
})
export class ManageChildModule {}
