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
  // Email triggering.
  @Post('trigger-email')
  @Version('1')
  @ApiOperation({ summary: 'Trigger mail from manage child.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
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
  @ApiConsumes('multipart/form-data')
  async triggerEmail(
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File,
  ) {
    req.body['intakes'] = JSON.parse(req.body['intakes']);
    req.body['templateAttachments'] = JSON.parse(
      req.body['templateAttachments'],
    );
    console.log(req.body);
    if (Object.keys(req.body['intakes']).length > 0) {
      const smtp = await this.smtpDetailsService.findActiveSmtp();
      if (Object.keys(smtp).length > 0) {
        //   return triggerEmailDto;
        const mail = await this.manageChildService.triggerMail(
          req,
          files,
          smtp,
        );
        return { statusCode: 201, message: `Email send succesfully.` };
      } else {
        throw new ConflictException(`Please activate smtp configuration.`);
      }
    } else {
      throw new ConflictException(`Please select the children.`);
    }
  }
}
