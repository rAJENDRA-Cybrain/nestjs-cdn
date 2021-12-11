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
} from '@nestjs/common';
import { ServiceCoordinatorService } from './service-coordinator.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateServiceCoordinatorDto,
  UpdateServiceCoordinatorDto,
} from '../../dto';
import { ServiceCoordinatorEntity } from '../../database';

@Controller('service-coordinator')
@ApiTags('Service Coordinator APIs')
export class ServiceCoordinatorController {
  constructor(
    private readonly serviceCoordinatorService: ServiceCoordinatorService,
  ) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create new service coordinator' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async createServiceCoordinator(
    @Body() servCoordinatorDto: CreateServiceCoordinatorDto,
  ) {
    const isSerCoordinatorExist: ServiceCoordinatorEntity =
      await this.serviceCoordinatorService.isSerCoordinatorExist(
        servCoordinatorDto.agencyId,
        servCoordinatorDto.emailId,
      );
    if (isSerCoordinatorExist) {
      throw new ConflictException(
        `${servCoordinatorDto.emailId} is already exist.`,
      );
    }
    const data: ServiceCoordinatorEntity =
      await this.serviceCoordinatorService.save(servCoordinatorDto);
    if (data) {
      return {
        statusCode: 200,
        message: `Saved Succesfully.`,
      };
    }
  }

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Get list of service coordinator.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findAllAgency() {
    const data: ServiceCoordinatorEntity[] =
      await this.serviceCoordinatorService.findAll();
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

  @Put(':serviceCoordinatorId')
  @Version('1')
  @ApiOperation({
    summary: 'Update individual referral agency by serviceCoordinatorId.',
  })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async update(
    @Param('serviceCoordinatorId', new ParseUUIDPipe({ version: '4' }))
    serviceCoordinatorId: string,
    @Body() updateData: UpdateServiceCoordinatorDto,
  ) {
    const isExist: ServiceCoordinatorEntity =
      await this.serviceCoordinatorService.isServiceCoExistInOtherId(
        serviceCoordinatorId,
        updateData,
      );
    console.log(isExist);
    if (isExist) {
      throw new ConflictException(`${updateData.name} is already exist.`);
    }
    const data = await this.serviceCoordinatorService.update(
      serviceCoordinatorId,
      updateData,
    );
    if (data.affected > 0) {
      return {
        statusCode: 201,
        message: `Updated Succesfully.`,
      };
    } else {
      throw new InternalServerErrorException();
    }
  }

  @Get(':agencyId')
  @Version('1')
  @ApiOperation({ summary: 'Get service coordinator according to agency.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findServiceCoordinators(
    @Param('agencyId', new ParseUUIDPipe({ version: '4' })) agencyId: string,
  ) {
    const data: any = await this.serviceCoordinatorService.findAllByAgencyId(
      agencyId,
    );
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

  @Delete(':serviceCoordinatorId')
  @Version('1')
  @ApiOperation({ summary: 'Archive service coordinator.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async archiveServiceCoordinator(
    @Param('serviceCoordinatorId', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ) {
    console.log(id);
    const isStatusUpdated =
      await this.serviceCoordinatorService.archiveServiceCoordinator(id);
    if (isStatusUpdated.affected > 0) {
      return {
        statusCode: 201,
        message: `Archived succesfully.`,
        data: isStatusUpdated,
      };
    }
  }
}
