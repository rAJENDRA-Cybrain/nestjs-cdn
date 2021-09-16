import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EmailTemplateService } from './email-template.service';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from '../../dto';

@Controller('email-template')
@ApiTags('Email template APIs')
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('files', {
      storage: diskStorage({
        destination: './uploads/email-attachments',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  createTemplate(
    @Request() req,
    @Body() emailTemplate: CreateEmailTemplateDto,
    @UploadedFiles() files: Express.Multer.File,
  ) {
    console.log(files);
    return this.emailTemplateService.create(emailTemplate);
  }

  @Get()
  findAll() {
    return this.emailTemplateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emailTemplateService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmailTemplateDto: UpdateEmailTemplateDto,
  ) {
    return this.emailTemplateService.update(+id, updateEmailTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emailTemplateService.remove(+id);
  }
}
