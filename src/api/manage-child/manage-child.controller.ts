import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Version,
  ParseUUIDPipe,
  Request,
  Put,
  UseGuards,
  Delete,
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
import { AuthGuard } from '@nestjs/passport';
@Controller('manage-child')
@ApiTags('Manage Child APIs')
export class ManageChildController {
  constructor(
    private readonly manageChildService: ManageChildService,
    private readonly conversationTypeService: ConversationTypeService,
    private readonly intakeService: IntakeService,
  ) {}

  @Get('')
  @Version('1')
  @ApiOperation({ summary: 'Get all children.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @UseGuards(AuthGuard('jwt'))
  public async findChildren(@Request() req) {
    const { userId, role } = req.user['payload'];
    const data = await this.manageChildService.findChild(userId, role);
    if (data.length > 0) {
      return {
        statusCode: 200,
        message: `Success.`,
        data: data,
      };
    } else {
      return {
        statusCode: 200,
        message: `No Data Found..`,
        data: [],
      };
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
    const notesData = await this.manageChildService.findNotes(intakeId);
    if (notesData) {
      return {
        statusCode: 200,
        message: `Success.`,
        data: notesData,
      };
    } else {
      return {
        statusCode: 200,
        message: `No Data Found..`,
        data: [],
      };
    }
  }

  @Post('/notes')
  @Version('1')
  @ApiOperation({ summary: 'Create child notes.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @UseGuards(AuthGuard('jwt'))
  public async createConversationType(
    @Body() notesDto: CreateManageChildNotesDto,
    @Request() req,
  ) {
    const { userId } = req.user['payload'];
    const { conversationTypeId, intakeId } = notesDto;

    const convData: ConversationTypeEntity =
      await this.conversationTypeService.findById(conversationTypeId);

    const childData = await this.intakeService.findById(intakeId);

    const userData: UserEntity = await this.intakeService.findEfcEmployee(
      userId,
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

  @Put('/notes/:notesId')
  @Version('1')
  @ApiOperation({ summary: 'Update child notes.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async updateChildNotes(
    @Param('notesId', new ParseUUIDPipe({ version: '4' })) notesId: string,
    @Body() updateManageChildNotesDto: UpdateManageChildNotesDto,
  ) {
    const { conversationTypeId } = updateManageChildNotesDto;

    const convData: ConversationTypeEntity =
      await this.conversationTypeService.findById(conversationTypeId);

    // const childData = await this.intakeService.findById(intakeId);

    // const userData: UserEntity = await this.intakeService.findEfcEmployee(
    //   addedBy,
    // );

    if (convData) {
      const data = await this.manageChildService.update(
        notesId,
        updateManageChildNotesDto,
        convData,
      );
      if (data.affected > 0) {
        return {
          statusCode: 200,
          message: `Updated Succesfully.`,
        };
      }
    }
  }

  @Delete('/notes/:notesId')
  @Version('1')
  @ApiOperation({ summary: 'Archive child notes.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async archiveChildNotes(
    @Param('notesId', new ParseUUIDPipe({ version: '4' })) notesId: string,
  ) {
    const isStatusUpdated = await this.manageChildService.updateStatus(notesId);
    if (isStatusUpdated.affected > 0) {
      return {
        statusCode: 201,
        message: `Note archived succesfully.`,
      };
    }
  }
}
