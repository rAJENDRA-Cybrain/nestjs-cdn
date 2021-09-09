import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ManageChildService } from './manage-child.service';
import { ConversationTypeService } from '../conversation-type/conversation-type.service';
import { IntakeService } from '../intake/intake.service';
import {
  CreateManageChildNotesDto,
  UpdateManageChildNotesDto,
} from '../../dto';
@Controller('manage-child')
@ApiTags('Manage Child APIs')
export class ManageChildController {
  constructor(
    private readonly manageChildService: ManageChildService,
    private readonly conversationTypeService: ConversationTypeService,
    private readonly intakeService: IntakeService,
  ) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create child notes.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  //@ApiExcludeEndpoint()
  public async createConversationType(
    @Body() createManageChildNotesDto: CreateManageChildNotesDto,
  ) {
    const { conversationTypeId, intakeId } = createManageChildNotesDto;
    const convData = await this.conversationTypeService.findById(
      conversationTypeId,
    );
    const childData = await this.intakeService.findById(intakeId);

    return { childData };
    // const data: ConversationTypeEntity =
    //   await this.conversationTypeService.save(createConversationTypeDto);
    // if (data) {
    //   return {
    //     statusCode: 200,
    //     message: `Saved Succesfully.`,
    //   };
    // }
  }
}
