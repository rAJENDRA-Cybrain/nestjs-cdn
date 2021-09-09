import { Body, Controller, Get, Post, Version } from '@nestjs/common';
import { ConversationTypeService } from './conversation-type.service';
import { ConversationTypeEntity } from '../../database';
import { CreateConversationTypeDto } from '../../dto';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
@Controller('conversation-type')
@ApiTags('Conversation Type APIs')
export class ConversationTypeController {
  constructor(
    private readonly conversationTypeService: ConversationTypeService,
  ) {}

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create conversation type' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  //@ApiExcludeEndpoint()
  public async createConversationType(
    @Body() createConversationTypeDto: CreateConversationTypeDto,
  ) {
    const data: ConversationTypeEntity =
      await this.conversationTypeService.save(createConversationTypeDto);
    if (data) {
      return {
        statusCode: 200,
        message: `Saved Succesfully.`,
      };
    }
  }

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Get list of Conversation type' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findAll() {
    const data: ConversationTypeEntity[] =
      await this.conversationTypeService.findAll();
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
}
