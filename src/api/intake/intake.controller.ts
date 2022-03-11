import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Version,
  ConflictException,
  ParseUUIDPipe,
  Put,
  InternalServerErrorException,
  Delete,
  UseGuards,
  Request,
  ParseBoolPipe,
} from '@nestjs/common';
import { IntakeService } from './intake.service';
import { ServiceCoordinatorService } from '../service-coordinator/service-coordinator.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UpdateIntakeDto,
  CreateReferralsDto,
  CreateAdditionalChildrenDto,
  UpdateAdditionalChildrenDto,
} from '../../dto';
import {
  IntakeEntity,
  ServiceCoordinatorEntity,
  UserEntity,
  AdditionalChildrenEntity,
} from '../../database';
import { sendEmail } from 'src/shared/node-mailer';
import { mailer } from 'src/shared/htmlMailer/early-start-intake-template';

import { SmtpDetailsService } from '../smtp-details/smtp-details.service';
import { AuthGuard } from '@nestjs/passport';

import { NotificationService } from '../notification/notification.service';
@Controller('intake-children')
@ApiTags('Early Intake Form APIs')
export class IntakeController {
  serviceCoordinator = new ServiceCoordinatorEntity();
  efcEmployee = new UserEntity();
  constructor(
    private readonly intakeService: IntakeService,
    private readonly notificationService: NotificationService,
    private readonly serviceCoordinatorService: ServiceCoordinatorService,
    private readonly smtpDetailsService: SmtpDetailsService,
  ) {}

  @Post('')
  @Version('1')
  @ApiOperation({ summary: 'Add new children referrals.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  async addReferrals(@Body() createReferralsDto: CreateReferralsDto) {
    const isChildrenExist: IntakeEntity[] =
      await this.intakeService.isChildExistForReferrals(createReferralsDto);

    if (isChildrenExist.length > 0 && !createReferralsDto.isForced) {
      return {
        statusCode: 200,
        isExist: true,
        data: isChildrenExist,
      };
    } else {
      if (createReferralsDto.isReferal === 'Yes') {
        this.serviceCoordinator =
          await this.serviceCoordinatorService.isServiceCoExistById(
            createReferralsDto.serviceCoordinatorId,
          );
      }

      const [EfcEmployee, smtp] = await Promise.all([
        this.intakeService.findEfcEmployee(createReferralsDto.efcEmployeeId),
        this.smtpDetailsService.findActiveSmtp(),
      ]);
      if (!smtp) {
        throw new ConflictException(`Configure smtp details.`);
      } else {
        const data: IntakeEntity = await this.intakeService.addReferrals(
          createReferralsDto,
          this.serviceCoordinator,
          EfcEmployee,
        );

        // Welcome Email Template
        const email_body =
          createReferralsDto.otherLanguage === 'Spanish'
            ? mailer.spanish(createReferralsDto.welcomeEmailContent)
            : mailer.english(createReferralsDto.welcomeEmailContent);
        const mailOptions = {
          email: data.parentEmail,
          subject:
            createReferralsDto.welcomeEmailSubject === ''
              ? 'Welcome to EFC Early Start Family Resource Center'
              : createReferralsDto.welcomeEmailSubject,
          body: email_body,
          replyTo: EfcEmployee.emailId,
          attachments: createReferralsDto.welcomeEmailAttachments || [],
        };

        if (data.parentEmail != '' || null || undefined) {
          await sendEmail(smtp, mailOptions);
        }

        // Allocate Service CoOrdinator Email and Notification.
        const redirect = `https://childcarecrm.cyberschoolmanager.com/crm/early-start-intake?id=${data.intakeId}&isEditable=true`;
        const mailOptions_ServiceCo = {
          email: EfcEmployee.emailId,
          subject: 'New Referral Received',
          body: mailer.serviceCoRef({
            ...createReferralsDto,
            ...smtp,
            redirect,
          }),
        };

        if (EfcEmployee) {
          await sendEmail(smtp, mailOptions_ServiceCo);
          await this.notificationService.notify(
            EfcEmployee.userId,
            'New Referral Received',
            `${createReferralsDto.childName} ${createReferralsDto.childLastName} is assigned with you.`,
            data.intakeId,
            'New Referral Received',
            redirect,
          );
        }

        if (data) {
          return {
            statusCode: 200,
            isExist: false,
            message: `Referral saved succesfully.`,
          };
        }
      }
    }
  }

  @Get('')
  @Version('1')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of intake children.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @UseGuards(AuthGuard('jwt'))
  public async findAllChildren(@Request() req) {
    const { userId, role } = req.user['payload'];
    const data: IntakeEntity[] = await this.intakeService.findAll(userId, role);
    if (data.length > 0) {
      return {
        statusCode: 200,
        message: `Success.`,
        data: data,
      };
    } else {
      return {
        statusCode: 200,
        message: 'No Data Found',
        data: [],
      };
    }
  }

  @Put(':intakeId')
  @Version('1')
  @ApiOperation({
    summary: 'Update individual children by intakeId.',
  })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async updateIntake(
    @Param('intakeId', new ParseUUIDPipe({ version: '4' }))
    intakeId: string,
    @Body() updateIntakeDto: UpdateIntakeDto,
  ) {
    // const isChildExistByOtherId: IntakeEntity =
    //   await this.intakeService.isChildExistByOtherId(intakeId, updateIntakeDto);

    // if (isChildExistByOtherId) {
    //   throw new ConflictException(
    //     `${updateIntakeDto.childName} ${updateIntakeDto.childMiddleName} ${updateIntakeDto.childLastName} already exist.`,
    //   );
    // } else {
    if (updateIntakeDto.isReferal === 'Yes') {
      this.serviceCoordinator =
        await this.serviceCoordinatorService.isServiceCoExistById(
          updateIntakeDto.serviceCoordinatorId,
        );
    }
    if (updateIntakeDto.efcEmployeeId) {
      this.efcEmployee = await this.intakeService.findEfcEmployee(
        updateIntakeDto.efcEmployeeId,
      );
    }
    const data = await this.intakeService.update(
      intakeId,
      updateIntakeDto,
      this.serviceCoordinator,
      this.efcEmployee,
    );

    if (data.affected > 0) {
      return {
        statusCode: 201,
        message: `Updated Succesfully.`,
      };
    } else {
      throw new InternalServerErrorException();
    }
    //}
  }

  @Delete(':intakeId')
  @Version('1')
  @ApiOperation({
    summary: 'Delete children by intakeId.',
  })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  async deleteChildren(
    @Param('intakeId', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ): Promise<any> {
    const isNotesExists = this.intakeService.isNotesExist(id);
    if ((await isNotesExists).childNotes.length > 0) {
      throw new ConflictException(
        `System Restricted. Notes are already present for this children.`,
      );
    } else {
      const data = await this.intakeService.deleteChildren(id);
      console.log(data);
      if (data.affected > 0) {
        return {
          statusCode: 201,
          message: `Children deleted succesfully.`,
        };
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Put('archive/:status/:intakeId')
  @Version('1')
  @ApiOperation({
    summary: 'Archive children by intakeId.',
  })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  async ArchiveChildren(
    @Param('status', new ParseBoolPipe()) status: boolean,
    @Param('intakeId', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ): Promise<any> {
    const data = await this.intakeService.archiveChildren(status, id);
    if (data.affected > 0) {
      return {
        statusCode: 201,
        message: status
          ? `Child recovered succesfully.`
          : `Child archived successfully.`,
      };
    } else {
      throw new InternalServerErrorException();
    }
  }

  @Post('addtional-children')
  @Version('1')
  @ApiOperation({ summary: 'Add new additional children' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async createAdditionalChild(
    @Body() addChildrenDto: CreateAdditionalChildrenDto,
  ) {
    const findAddChildrenExist: AdditionalChildrenEntity =
      await this.intakeService.isAdditionalChildrenExist(addChildrenDto);

    if (findAddChildrenExist) {
      throw new ConflictException(`${addChildrenDto.childName} already exists`);
    }
    const data: AdditionalChildrenEntity =
      await this.intakeService.saveAdditionalChildren(addChildrenDto);
    if (data) {
      return {
        statusCode: 200,
        message: `Saved Succesfully.`,
      };
    }
  }

  @Get('addtional-children/:intakeId')
  @Version('1')
  @ApiOperation({
    summary: 'Get list of addtional children for particular child by intakeId.',
  })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findAddChildren(
    @Param('intakeId', new ParseUUIDPipe({ version: '4' }))
    intakeId: string,
  ) {
    const data: AdditionalChildrenEntity[] =
      await this.intakeService.findAdditionalChildren(intakeId as string);
    if (data.length > 0) {
      return {
        statusCode: 200,
        message: `Success.`,
        data: data,
      };
    } else {
      return {
        statusCode: 200,
        message: 'No Data Found',
        data: [],
      };
    }
  }

  @Put('addtional-children/:additionalChildrenId')
  @Version('1')
  @ApiOperation({
    summary: 'Update additional children by additionalChildrenId.',
  })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async updateConversation(
    @Param('additionalChildrenId', new ParseUUIDPipe({ version: '4' }))
    additionalChildrenId: string,
    @Body() updateAdditionalChildrenDto: UpdateAdditionalChildrenDto,
  ) {
    const data = await this.intakeService.updateAdditionalChildren(
      additionalChildrenId,
      updateAdditionalChildrenDto,
    );
    if (data) {
      return {
        statusCode: 201,
        message: `Updated Succesfully.`,
        data: [],
      };
    }
  }

  @Delete('addtional-children/:additionalChildrenId')
  @Version('1')
  @ApiOperation({
    summary: 'Archive the additional children by additionalChildrenId.',
  })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  async deleteAddChildren(
    @Param('additionalChildrenId', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ): Promise<any> {
    const data = await this.intakeService.deleteAddChildren(id);
    if (data.affected > 0) {
      return {
        statusCode: 201,
        message: `Archived Succesfully.`,
      };
    } else {
      throw new InternalServerErrorException();
    }
  }
}

// @Post()
// @Version('1')
// @ApiOperation({ summary: 'Add new children.' })
// @ApiResponse({
//   status: 200,
//   description: 'successful operation',
// })
// async intakeChild(@Body() createIntakeDto: CreateIntakeDto) {
//   // first check if child is exist with same name ,dob and parent name.
//   const isChildExist: IntakeEntity[] = await this.intakeService.isChildExist(
//     createIntakeDto,
//   );
//   //console.log(isChildExist);
//   if (isChildExist.length > 0) {
//     throw new ConflictException(
//       `${createIntakeDto.childName} already exist.`,
//     );
//   } else {
//     if (createIntakeDto.isReferal == 'Yes') {
//       this.serviceCoordinator =
//         await this.serviceCoordinatorService.isServiceCoExistById(
//           createIntakeDto.serviceCoordinatorId,
//         );
//     } else {
//       createIntakeDto.reasonForReferal = [];
//     }

//     if (createIntakeDto.efcEmployeeId) {
//       this.efcEmployee = await this.intakeService.findEfcEmployee(
//         createIntakeDto.efcEmployeeId,
//       );
//     }

//     const data: IntakeEntity = await this.intakeService.save(
//       createIntakeDto,
//       this.serviceCoordinator,
//       this.efcEmployee,
//     );

//     const smtp = await this.smtpDetailsService.findActiveSmtp();
//     if (!smtp) {
//       throw new ConflictException(`Configuration smtp details.`);
//     }
//     const EmailData = {
//       timestamp: `${new Date().toLocaleString('default', {
//         month: 'long',
//       })}  ${new Date().getDate()}, ${new Date().getFullYear()}`,
//       childName: data.childName,
//       parentsName: data.parentName,
//     };
//     const mailOptions = {
//       email: data.parentEmail,
//       subject: 'Welcome to EFC Early Start Family Resource Center',
//       body: mailer.mailerhtml(EmailData),
//       attachments: [],
//     };
//     //console.log(EmailData, mailOptions);
//     await sendEmail(smtp, mailOptions);
//     if (data) {
//       return {
//         statusCode: 200,
//         message: `${createIntakeDto.childName} Saved Succesfully.`,
//       };
//     }
//   }
// }
