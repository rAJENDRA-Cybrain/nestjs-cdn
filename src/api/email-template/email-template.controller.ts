import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Version,
  ConflictException,
  Req,
  Get,
  Put,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { EmailTemplateService } from './email-template.service';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from '../../dto';

@Controller('email-template')
@ApiTags('Email template APIs')
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create email template.' })
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
  async createTemplate(
    @Req() req: Request,
    @Body() template: CreateEmailTemplateDto,
    @UploadedFiles() files: Express.Multer.File,
  ) {
    if (await this.emailTemplateService.findIsExist(template)) {
      throw new ConflictException(
        `${template.templateTitle} is already exist.`,
      );
    } else {
      const data = await this.emailTemplateService.saveEmailTemplate(template);
      if (data) {
        if (Object.keys(files).length > 0) {
          await this.emailTemplateService.saveAttachments(
            req,
            data.templateId,
            files,
          );
        }
        return {
          statusCode: 200,
          message: `Saved Succesfully.`,
        };
      }
    }
  }

  @Get('')
  @Version('1')
  @ApiOperation({ summary: 'Get all email templates.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findEmailTemplate() {
    const data = await this.emailTemplateService.findAllEmailTemplates();
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

  @Get(':templateId')
  @Version('1')
  @ApiOperation({ summary: 'Get individual email templates.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findIndividualEmailTemplate(
    @Param('templateId', new ParseUUIDPipe({ version: '4' }))
    templateId: string,
  ) {
    const data = await this.emailTemplateService.findIndividualEmailTemplate(
      templateId,
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

  @Put(':templateId')
  @Version('1')
  @ApiOperation({ summary: 'Update email template.' })
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
  async updateEmailTemplates(
    @Req() req: Request,
    @Param('templateId', new ParseUUIDPipe({ version: '4' }))
    templateId: string,
    @Body() template: UpdateEmailTemplateDto,
    @UploadedFiles() files: Express.Multer.File,
  ) {
    const isExist =
      await this.emailTemplateService.isEmailTemplateExistByOtherId(
        templateId,
        template,
      );
    if (isExist) {
      throw new ConflictException(
        `${template.templateTitle} is already exist.`,
      );
    } else {
      const updateEmailTemp =
        await this.emailTemplateService.updateEmailTemplate(
          templateId,
          template,
        );
      if (updateEmailTemp.affected > 0) {
        if (Object.keys(files).length) {
          await this.emailTemplateService.updateEmailAttachment(
            req,
            templateId,
            files,
          );
        }
        return {
          statusCode: 200,
          message: `Updated Succesfully.`,
        };
      }
    }
  }

  @Delete(':templateId')
  @Version('1')
  @ApiOperation({ summary: 'Archive email templates.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async archiveEmailTemplates(
    @Param('templateId', new ParseUUIDPipe({ version: '4' }))
    templateId: string,
  ) {
    const isStatusUpdated =
      await this.emailTemplateService.archiveEmailTemplate(templateId);
    if (isStatusUpdated.affected > 0) {
      return {
        statusCode: 201,
        message: `Archived succesfully.`,
      };
    }
  }
}
