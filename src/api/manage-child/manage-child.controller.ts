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
  UseInterceptors,
  Req,
  UploadedFiles,
  ConflictException,
  Query,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ManageChildService } from './manage-child.service';
import { ConversationTypeService } from '../conversation-type/conversation-type.service';
import { IntakeService } from '../intake/intake.service';
import {
  CreateManageChildNotesDto,
  UpdateManageChildNotesDto,
  TriggerEmailDto,
} from '../../dto';
import {
  UserEntity,
  IntakeEntity,
  ConversationTypeEntity,
  ManageChildNotesEntity,
  SmtpDetailEntity,
} from '../../database';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { SmtpDetailsService } from '../smtp-details/smtp-details.service';
@Controller('manage-child')
@ApiTags('Manage Child APIs')
export class ManageChildController {
  constructor(
    private readonly manageChildService: ManageChildService,
    private readonly conversationTypeService: ConversationTypeService,
    private readonly intakeService: IntakeService,
    private readonly smtpDetailsService: SmtpDetailsService,
  ) {}

  @Get('')
  @Version('1')
  @ApiOperation({ summary: 'Get all children.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @ApiBearerAuth()
  @ApiQuery({
    name: 'child_name',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'dob',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'relation',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'diagnosis',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'intake_start_date',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'intake_end_date',
    type: String,
    required: false,
  })
  @UseGuards(AuthGuard('jwt'))
  public async findChildren(
    @Request() req,
    @Query('child_name') child_name: string,
    @Query('dob') dob: string,
    @Query('relation') relation: string,
    @Query('diagnosis') diagnosis: string,
    @Query('intake_start_date') intake_start_date: string,
    @Query('intake_end_date') intake_end_date: string,
  ) {
    const { userId, role } = req.user['payload'];
    const data = await this.manageChildService.findChild(
      userId,
      role,
      child_name,
      dob,
      relation,
      diagnosis,
      intake_start_date,
      intake_end_date,
    );
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

  @Get('/archived-children')
  @Version('1')
  @ApiOperation({ summary: 'Get all archived children.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  public async findArchivedChildren(@Request() req) {
    const { userId, role } = req.user['payload'];
    const data = await this.manageChildService.findArchivedChild(userId, role);
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
    const result = [];
    const [notesData, emailLogs] = await Promise.all([
      await this.manageChildService.findNotes(intakeId),
      await this.manageChildService.findTriggeredEmailToAChild(intakeId),
    ]);
    if (notesData?.childNotes?.length > 0) {
      notesData.childNotes.forEach((e) => {
        result.push({
          id: e.notesId,
          subject: e.conversationType.description,
          content: e.notes,
          date: e.date,
          timestamp: e.timestamp,
          addedBy: e.notesAddedBy.firstName + ' ' + e.notesAddedBy.lastName,
          createdAt: e.createdAt,
          conversationTypeId: e.conversationType.conversationTypeId,
          format: 'note',
        });
      });
    }
    if (emailLogs.length > 0) {
      emailLogs.forEach((e: any) => {
        result.push({
          id: e.emailLogId,
          subject: e.emailLogSubject,
          content: e.emailLogBody,
          date: '',
          timestamp: '',
          addedBy: e?.user || '',
          createdAt: e.createdAt,
          conversationTypeId: '',
          format: 'email',
        });
      });
    }
    if (result.length > 0) {
      return {
        statusCode: 200,
        message: `Success.`,
        data: result,
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
  // Email triggering.
  @Post('trigger-email')
  @Version('1')
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @ApiOperation({ summary: 'Trigger mail from manage child.' })
  @UseInterceptors(
    FilesInterceptor('attachments', 5, {
      storage: diskStorage({
        destination: './webroot/email-attachments',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @UseGuards(AuthGuard('jwt'))
  @ApiConsumes('multipart/form-data')
  async triggerEmail(
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File,
  ) {
    req.body['intakes'] = JSON.parse(req.body['intakes']);
    req.body['templateAttachments'] = JSON.parse(
      req.body['templateAttachments'],
    );
    if (Object.keys(req.body['intakes']).length > 0) {
      const smtp = await this.smtpDetailsService.findActiveSmtp();
      if (Object.keys(smtp).length > 0) {
        const email_batch = await this.manageChildService.triggerMail(
          req,
          files,
          smtp,
        );
        return {
          statusCode: 201,
          message: `Email's are processed successfully .`,
          data: { batch: email_batch },
        };
      } else {
        throw new ConflictException(`Please activate SMTP configuration.`);
      }
    } else {
      throw new ConflictException(`Please select the children.`);
    }
  }
  @Get('trigger-email/:intakeId')
  @Version('1')
  @ApiOperation({
    summary: 'Get individual children triggered emails by intakeId.',
  })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findAllTriggeredEmail(
    @Param('intakeId', new ParseUUIDPipe({ version: '4' })) intakeId: string,
  ) {
    const Data = await this.manageChildService.findTriggeredEmailToAChild(
      intakeId,
    );
    if (Data) {
      return {
        statusCode: 200,
        message: `Success.`,
        data: Data,
      };
    } else {
      return {
        statusCode: 200,
        message: `No Data Found..`,
        data: [],
      };
    }
  }

  @Get('mail-progress/:userId')
  @Version('1')
  @ApiOperation({
    summary: 'Get user mail progress.',
  })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findMailActiveList(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    const Data: any = await this.manageChildService.findMailActiveList(userId);
    if (Data) {
      return {
        statusCode: 200,
        message: `Success.`,
        data: Data,
      };
    } else {
      return {
        statusCode: 200,
        message: `No Data Found..`,
        data: [],
      };
    }
  }
}
