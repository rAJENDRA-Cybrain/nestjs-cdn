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
import { TransitionPlanService } from './transition-plan.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateTransitionPlanDto } from '../../dto';

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
  public async findAllChildrenAboveTwoPointFiveYears() {
    const data = await this.transitionPlanService.findChildren(
      'eb2c0cec-506d-4368-b7f1-e8bf350029e9', //SA
      //'2029dc78-6e96-4bd0-bd07-1d25022204dd', //OP
    );
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
