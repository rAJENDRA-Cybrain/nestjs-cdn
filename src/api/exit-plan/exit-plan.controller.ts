import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Put,
  Version,
} from '@nestjs/common';
import { ExitPlanService } from './exit-plan.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateExitPlanDto } from '../../dto';

@Controller('exit-plan')
@ApiTags('Exist Plan 3 Years APIs')
export class ExitPlanController {
  constructor(private readonly exitPlanService: ExitPlanService) {}

  @Version('1')
  @Get('3-years')
  @ApiOperation({
    summary: 'Get list of intake children above 3 years for exit.',
  })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findAllChildrenAboveThreeYears() {
    const data = await this.exitPlanService.findChildren(
      '2029dc78-6e96-4bd0-bd07-1d25022204dd',
    );
    const filteredData = data.filter(function (el) {
      return el['age']['years'] >= 3;
    });
    if (filteredData.length > 0) {
      return {
        statusCode: 200,
        message: `Success.`,
        data: filteredData,
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
    summary: 'Update exit plan details by intakeId.',
  })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async updateExitPlan(
    @Param('intakeId', new ParseUUIDPipe({ version: '4' }))
    intakeId: string,
    @Body() updateExitPlanDto: UpdateExitPlanDto,
  ) {
    const data = await this.exitPlanService.update(intakeId, updateExitPlanDto);
    if (data.affected > 0) {
      return {
        statusCode: 201,
        message: `Updated Succesfully.`,
      };
    } else {
      throw new InternalServerErrorException();
    }
  }
}
