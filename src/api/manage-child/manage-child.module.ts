import { Module } from '@nestjs/common';
import { ManageChildService } from './manage-child.service';
import { ManageChildController } from './manage-child.controller';

@Module({
  controllers: [ManageChildController],
  providers: [ManageChildService],
})
export class ManageChildModule {}
