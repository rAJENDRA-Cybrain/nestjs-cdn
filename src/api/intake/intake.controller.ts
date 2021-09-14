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
import { IntakeService } from './intake.service';
import { ServiceCoordinatorService } from '../service-coordinator/service-coordinator.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateIntakeDto,
  UpdateIntakeDto,
  CreateAdditionalChildrenDto,
  UpdateAdditionalChildrenDto,
} from '../../dto';
import {
  IntakeEntity,
  ServiceCoordinatorEntity,
  UserEntity,
  AdditionalChildrenEntity,
} from '../../database';

@Controller('intake-children')
@ApiTags('Early Intake Form APIs')
export class IntakeController {
  serviceCoordinator = new ServiceCoordinatorEntity();
  efcEmployee = new UserEntity();
  constructor(
    private readonly intakeService: IntakeService,
    private readonly serviceCoordinatorService: ServiceCoordinatorService,
  ) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Add new children.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async intakeChild(@Body() createIntakeDto: CreateIntakeDto) {
    // first check if child is exist with same name ,dob and parent name.
    const isChildExist: IntakeEntity = await this.intakeService.isChildExist(
      createIntakeDto,
    );
    if (isChildExist) {
      throw new ConflictException(
        `${createIntakeDto.childName} already exist.`,
      );
    }

    if (createIntakeDto.isReferal == 'Yes') {
      this.serviceCoordinator =
        await this.serviceCoordinatorService.isServiceCoExistById(
          createIntakeDto.serviceCoordinatorId,
        );
    } else {
      createIntakeDto.reasonForReferal = [];
    }

    if (createIntakeDto.efcEmployeeId) {
      this.efcEmployee = await this.intakeService.findEfcEmployee(
        createIntakeDto.efcEmployeeId,
      );
    }

    const data: IntakeEntity = await this.intakeService.save(
      createIntakeDto,
      this.serviceCoordinator,
      this.efcEmployee,
    );
    if (data) {
      return {
        statusCode: 200,
        message: `${createIntakeDto.childName} Saved Succesfully.`,
      };
    }
  }

  @Get('')
  @Version('1')
  @ApiOperation({ summary: 'Get list of intake children.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findAllChildren() {
    const data: IntakeEntity[] = await this.intakeService.findAll();
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
    const isChildExistByOtherId: IntakeEntity =
      await this.intakeService.isChildExistByOtherId(intakeId, updateIntakeDto);

    if (isChildExistByOtherId) {
      throw new ConflictException(
        `${updateIntakeDto.childName} is already exist.`,
      );
    }

    if (updateIntakeDto.isReferal == 'Yes') {
      this.serviceCoordinator =
        await this.serviceCoordinatorService.isServiceCoExistById(
          updateIntakeDto.serviceCoordinatorId,
        );
    } else {
      updateIntakeDto.reasonForReferal = [];
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
      throw new ConflictException(
        `${addChildrenDto.childName} is already exist.`,
      );
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
