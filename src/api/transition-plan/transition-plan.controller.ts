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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTransitionPlanDto } from '../../dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('transition-plan')
@ApiTags('Transition Plan 2.5 Years APIs')
export class TransitionPlanController {
  constructor(private readonly transitionPlanService: TransitionPlanService) {}
  @Get('2.5-years')
  @Version('1')
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
    const filteredData = data.filter(function (el) {
      el['tp_status'] =
        (el.tpQuestionToParentOneAns &&
          el.tpQuestionToParentTwoAns &&
          el.tpQuestionToParentThirdAns) == ''
          ? 'Pending'
          : 'Completed';
      return el['age']['years'] <= 2 && el['age']['months'] > 5;
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
}
