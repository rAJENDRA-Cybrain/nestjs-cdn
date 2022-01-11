import {
  Controller,
  Put,
  Get,
  Post,
  Body,
  Param,
  Version,
  ParseUUIDPipe,
  ConflictException,
} from '@nestjs/common';
import { SmtpDetailEntity } from '../../database';
import { SmtpDetailsService } from './smtp-details.service';
import {
  CreateSmtpDetailDto,
  UpdateSmtpDetailDto,
  UpdateSmtpDetailStatusDto,
} from '../../dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('smtp-details')
@ApiTags('Smtp Details APIs')
export class SmtpDetailsController {
  constructor(private readonly smtpDetailsService: SmtpDetailsService) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create smtp details' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async createSmtpDetail(
    @Body() createSmtpDetailDto: CreateSmtpDetailDto,
  ) {
    const isExist: SmtpDetailEntity =
      await this.smtpDetailsService.isSmtpDetailsExist(createSmtpDetailDto);
    if (isExist) {
      throw new ConflictException(
        `${createSmtpDetailDto.smtpUserName} already exists`,
      );
    } else {
      const data: SmtpDetailEntity = await this.smtpDetailsService.save(
        createSmtpDetailDto,
      );
      if (data) {
        return {
          statusCode: 200,
          message: `Saved Succesfully.`,
        };
      }
    }
  }

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Get list of smtp details' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findSmtpDetails() {
    const data: SmtpDetailEntity[] = await this.smtpDetailsService.findAll();
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

  @Put(':smtpId')
  @Version('1')
  @ApiOperation({ summary: 'Update individual smtp by smtpId.' })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async updateSmtpDetails(
    @Param('smtpId', new ParseUUIDPipe({ version: '4' })) smtpId: string,
    @Body() updateSmtpDetailDto: UpdateSmtpDetailDto,
  ) {
    const isExist: SmtpDetailEntity =
      await this.smtpDetailsService.isSmtpDetailsExistById(smtpId);
    if (isExist) {
      const data = await this.smtpDetailsService.update(
        smtpId,
        updateSmtpDetailDto,
      );
      if (data) {
        return {
          statusCode: 201,
          message: `Updated Succesfully.`,
          data: [],
        };
      }
    }
  }

  @Put('status/:smtpId')
  @Version('1')
  @ApiOperation({ summary: 'Update individual smtp status by smtpId.' })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async updateStatus(
    @Param('smtpId', new ParseUUIDPipe({ version: '4' })) smtpId: string,
    @Body() updateSmtpDetailStatusDto: UpdateSmtpDetailStatusDto,
  ) {
    const { isActive, isDelete } = updateSmtpDetailStatusDto;
    if (isActive) {
      const activeSmtp = await this.smtpDetailsService.findActiveSmtp();
      //console.log('====== > ', activeSmtp);
      if (activeSmtp) {
        await this.smtpDetailsService.updateStatus(
          activeSmtp.smtpId,
          false,
          false,
        );
      }
      const isStatusUpdated = await this.smtpDetailsService.updateStatus(
        smtpId,
        true,
        false,
      );
      if (isStatusUpdated.affected > 0) {
        return {
          statusCode: 201,
          message: `Status Updated Succesfully.`,
        };
      }
    }
    if (isDelete) {
      const isStatusUpdated = await this.smtpDetailsService.updateStatus(
        smtpId,
        false,
        true,
      );
      if (isStatusUpdated.affected > 0) {
        return {
          statusCode: 201,
          message: `Smtp details deleted succesfully.`,
        };
      }
    }
  }
}
