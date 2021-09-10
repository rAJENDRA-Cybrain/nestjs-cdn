import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ManageChildService } from './manage-child.service';
import { ConversationTypeService } from '../conversation-type/conversation-type.service';
import { IntakeService } from '../intake/intake.service';
import {
  CreateManageChildNotesDto,
  UpdateManageChildNotesDto,
} from '../../dto';
import {
  UserEntity,
  IntakeEntity,
  ConversationTypeEntity,
  ManageChildNotesEntity,
} from '../../database';
@Controller('manage-child')
@ApiTags('Manage Child APIs')
export class ManageChildController {
  constructor(
    private readonly manageChildService: ManageChildService,
    private readonly conversationTypeService: ConversationTypeService,
    private readonly intakeService: IntakeService,
  ) {}

  @Post('/notes')
  @Version('1')
  @ApiOperation({ summary: 'Create child notes.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  //@ApiExcludeEndpoint()
  public async createConversationType(
    @Body() notesDto: CreateManageChildNotesDto,
  ) {
    const { conversationTypeId, intakeId, addedBy } = notesDto;

    const convData: ConversationTypeEntity =
      await this.conversationTypeService.findById(conversationTypeId);

    const childData = await this.intakeService.findById(intakeId);

    const userData: UserEntity = await this.intakeService.findEfcEmployee(
      addedBy,
    );

    if (convData && childData && userData) {
      const data: ManageChildNotesEntity = await this.manageChildService.save(
        notesDto,
        convData,
        childData,
        userData,
      );
      if (data) {
        return {
          statusCode: 200,
          message: `Saved Succesfully.`,
        };
      }
    }
  }

  @Get('/notes/:intakeId')
  @Version('1')
  @ApiOperation({ summary: 'Get individual children notes by intakeId.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async find(
    @Param('intakeId', new ParseUUIDPipe({ version: '4' })) intakeId: string,
  ) {
    const notesData = await this.manageChildService.findAll(intakeId);
    return {
      statusCode: 200,
      message: `Success.`,
      data: notesData,
    };
  }
}
