import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Put,
  Request,
  UseGuards,
  Version,
} from '@nestjs/common';
import { TransitionPlanService } from './transition-plan.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateTransitionPlanDto } from '../../dto';
import { AuthGuard } from '@nestjs/passport';
import { AgeCalculator } from '@dipaktelangre/age-calculator';

@Controller('transition-plan')
@ApiTags('Transition Plan 2.5 Years APIs')
export class TransitionPlanController {
  constructor(private readonly transitionPlanService: TransitionPlanService) {}
  @Get('2.5-years')
  @Version('1')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get list of intake children above 2.5 years for transition plan.',
  })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @UseGuards(AuthGuard('jwt'))
  public async findAllChildrenAboveTwoPointFiveYears(@Request() req) {
    const { userId, role } = req.user['payload'];
    const data = await this.transitionPlanService.findChildren(userId, role);
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i]['daysCount'] = await this.getNumberOfDays(data[i].dateOfBirth);
        data[i]['age'] = AgeCalculator.getAge(new Date(data[i].dateOfBirth));
      }
    }
    const filteredData = data.filter(function (el) {
      el['tp_status'] =
        (el.tpQuestionToParentOneAns &&
          el.tpQuestionToParentTwoAns &&
          el.tpQuestionToParentThirdAns) == ''
          ? 'Pending'
          : 'Completed';
      return el['age']['years'] < 3;
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
    summary: 'Update transition plan details by intakeId.',
  })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async updateTransitionPlan(
    @Param('intakeId', new ParseUUIDPipe({ version: '4' }))
    intakeId: string,
    @Body() updateTransitionPlanDto: UpdateTransitionPlanDto,
  ) {
    const data = await this.transitionPlanService.update(
      intakeId,
      updateTransitionPlanDto,
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
