import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
  ConflictException,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { AgencyService } from './agency.service';
import { CreateAgencyDto, UpdateAgencyDto } from 'src/dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AgencyEntity } from 'src/database';

@Controller('agency')
@ApiTags('Agency APIs')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Get list of agency' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findAllAgency() {
    const data: AgencyEntity[] = await this.agencyService.findAllAgency();
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

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create Agency' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async createAgency(@Body() createAgencyDto: CreateAgencyDto) {
    const isExist: AgencyEntity = await this.agencyService.isAgencyExist(
      createAgencyDto.agencyName,
    );
    if (isExist) {
      throw new ConflictException(
        `${createAgencyDto.agencyName} is already exist.`,
      );
    }
    const data: AgencyEntity = await this.agencyService.save(createAgencyDto);
    if (data) {
      return {
        statusCode: 200,
        message: `${createAgencyDto.agencyName} Saved Succesfully.`,
        data: data,
      };
    }
  }

  @Get(':agencyId')
  @Version('1')
  @ApiOperation({ summary: 'Get individual agency by agencyId.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findOneAgency(
    @Param('agencyId', new ParseUUIDPipe({ version: '4' })) agencyId: string,
  ) {
    const data: AgencyEntity = await this.agencyService.findOneAgency(agencyId);
    if (Object.keys(data).length > 0) {
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

  @Put(':agencyId')
  @Version('1')
  @ApiOperation({ summary: 'Update individual agency by agencyId.' })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async updateRole(
    @Param('agencyId', new ParseUUIDPipe({ version: '4' })) agencyId: string,
    @Body() updateAgencyDto: UpdateAgencyDto,
  ) {
    const isExist: AgencyEntity = await this.agencyService.isAgencyExistById(
      agencyId,
      updateAgencyDto.agencyName,
    );
    if (!isExist) {
      const data = await this.agencyService.update(agencyId, updateAgencyDto);
      if (data) {
        return {
          statusCode: 201,
          message: `${updateAgencyDto.agencyName} Updated Succesfully.`,
          data: [],
        };
      }
    } else {
      throw new ConflictException(
        `${updateAgencyDto.agencyName} already exist.`,
      );
    }
  }

  @Delete(':agencyId')
  @Version('1')
  @ApiOperation({ summary: 'Archive agency.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async archiveAgency(
    @Param('agencyId', new ParseUUIDPipe({ version: '4' }))
    agencyId: string,
  ) {
    const isStatusUpdated = await this.agencyService.archiveAgency(agencyId);
    if (isStatusUpdated) {
      return {
        statusCode: 201,
        message: `Data deleted succesfully.`,
        data: isStatusUpdated,
      };
    }
  }
}
