import {
  Controller,
  Post,
  Body,
  Version,
  UseGuards,
  Request,
  Get,
  Put,
  Param,
  ParseUUIDPipe,
  Delete,
  InternalServerErrorException,
} from '@nestjs/common';
import { RecordConversationService } from './record-conversation.service';
import {
  CreateRecordConversationDto,
  UpdateRecordConversationDto,
} from '../../dto';
import { RecordConversationEntity } from '../../database';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('record-conversation')
@ApiTags('Record Conversations APIs')
export class RecordConversationController {
  constructor(
    private readonly recordConversationService: RecordConversationService,
  ) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create conversation' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @UseGuards(AuthGuard('jwt'))
  public async recordConversation(
    @Request() req,
    @Body() createRecordConversationDto: CreateRecordConversationDto,
  ) {
    const data: RecordConversationEntity =
      await this.recordConversationService.saveConversation(
        req.user['payload'].userId, // 'eb2c0cec-506d-4368-b7f1-e8bf350029e9', //
        createRecordConversationDto,
      );
    if (data) {
      return {
        statusCode: 200,
        message: `Saved Succesfully.`,
      };
    }
  }

  @Get('')
  @Version('1')
  @ApiOperation({
    summary: 'Get list of recoded conversations.',
  })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findConversations() {
    const data: RecordConversationEntity[] =
      await this.recordConversationService.findRecoddedConversations();
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

  @Put(':conversationId')
  @Version('1')
  @ApiOperation({
    summary: 'Update individual recorded conversation by conversationId.',
  })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async updateConversation(
    @Param('conversationId', new ParseUUIDPipe({ version: '4' }))
    conversationId: string,
    @Body() updateRecordConversationDto: UpdateRecordConversationDto,
  ) {
    const data = await this.recordConversationService.updateConversation(
      conversationId,
      updateRecordConversationDto,
    );
    if (data) {
      return {
        statusCode: 201,
        message: `Updated Succesfully.`,
        data: [],
      };
    }
  }

  @Delete(':conversationId')
  @Version('1')
  @ApiOperation({
    summary: 'Archive the individual recorded conversation by conversationId.',
  })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  async deleteConversation(
    @Param('conversationId', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ): Promise<any> {
    const data = await this.recordConversationService.deleteConversation(id);
    if (data.affected > 0) {
      return {
        statusCode: 201,
        message: `Data deleted succesfully.`,
      };
    } else {
      throw new InternalServerErrorException();
    }
  }
}
