import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
  Version,
  Request,
} from '@nestjs/common';
import { ExitPlanService } from './exit-plan.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateExitPlanDto } from '../../dto';
import { AuthGuard } from '@nestjs/passport';
import { AgeCalculator } from '@dipaktelangre/age-calculator';

@Controller('exit-plan')
@ApiTags('Exist Plan 3 Years APIs')
export class ExitPlanController {
  constructor(private readonly exitPlanService: ExitPlanService) {}

  @Version('1')
  @Get('3-years')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get list of intake children above 3 years for exit.',
  })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @UseGuards(AuthGuard('jwt'))
  public async findAllChildrenAboveThreeYears(@Request() req) {
    const { userId, role } = req.user['payload'];
    const data = await this.exitPlanService.findChildren(userId, role);
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i]['daysCount'] = await this.getNumberOfDays(data[i].dateOfBirth);
        data[i]['age'] = AgeCalculator.getAge(new Date(data[i].dateOfBirth));
      }
    }
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

  private async getNumberOfDays(date: any) {
    const date1 = new Date(date);
    const date2 = new Date();

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.round(diffInTime / oneDay);

    return diffInDays;
  }
}
