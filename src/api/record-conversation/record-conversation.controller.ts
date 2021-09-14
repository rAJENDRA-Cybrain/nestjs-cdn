import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecordConversationService } from './record-conversation.service';
import { CreateRecordConversationDto } from './dto/create-record-conversation.dto';
import { UpdateRecordConversationDto } from './dto/update-record-conversation.dto';

@Controller('record-conversation')
export class RecordConversationController {
  constructor(private readonly recordConversationService: RecordConversationService) {}

  @Post()
  create(@Body() createRecordConversationDto: CreateRecordConversationDto) {
    return this.recordConversationService.create(createRecordConversationDto);
  }

  @Get()
  findAll() {
    return this.recordConversationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordConversationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecordConversationDto: UpdateRecordConversationDto) {
    return this.recordConversationService.update(+id, updateRecordConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordConversationService.remove(+id);
  }
}
