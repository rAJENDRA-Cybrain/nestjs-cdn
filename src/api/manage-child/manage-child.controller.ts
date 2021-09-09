import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ManageChildService } from './manage-child.service';

@Controller('manage-child')
@ApiTags('Manage Child APIs')
export class ManageChildController {
  constructor(private readonly manageChildService: ManageChildService) {}

  @Version('1')
  @Get('conversation-type')
  @ApiOperation({
    summary: 'Get list of conversation type.',
  })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async getAllConversationType() {
    return {
      statusCode: 200,
      message: `Success.`,
      data: [
        { id: 1, type: 'FF', description: 'FF-Face to face home visit' },
        { id: 2, type: 'TC', description: 'TC-Telephone call' },
        { id: 3, type: 'IH', description: 'IH-Intake- home visit' },
        { id: 4, type: 'IP', description: 'IP-Intake -phone call/zoom' },
        {
          id: 5,
          type: 'T',
          description: 'T-Trainings you are participating in',
        },
        { id: 6, type: 'PP', description: 'PP-Parent to parent meetings' },
        {
          id: 7,
          type: 'PA',
          description:
            'PA-Public Awareness-information dissemination (participating in events such as resource fairs)',
        },
        {
          id: 8,
          type: 'FP',
          description:
            'FP-Family professional collaboration (meetings with Kern Regional Center, Schools other agencies)',
        },
        { id: 9, type: 'TA', description: 'TA-Transition Assistance' },
        { id: 10, type: 'W', description: 'W-Webinars' },
        { id: 11, type: 'Other', description: 'Other' },
      ],
    };
  }
}
