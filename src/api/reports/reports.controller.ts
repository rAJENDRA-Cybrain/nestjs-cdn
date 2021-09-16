import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
@Controller('reports')
@ApiTags('Reports APIs')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('generate')
  @Version('1')
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @ApiOperation({ summary: '' })
  @ApiQuery({
    name: 'from_date',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'to_date',
    type: String,
    required: false,
  })
  async generateNewReports(
    @Query('from_date') from_date: string,
    @Query('to_date') to_date: string,
  ) {
    const response = await this.reportsService.findEmployeeReports(
      from_date,
      to_date,
    );
    if (response.length > 0) {
      return {
        statusCode: 200,
        message: `Success.`,
        data: response,
      };
    } else {
      return {
        statusCode: 200,
        message: `No Data Found..`,
        data: [],
      };
    }
  }

  @Get(':filter_year')
  @Version('1')
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @ApiOperation({ summary: '' })
  @ApiQuery({
    name: 'from_date',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'to_date',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'year',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'month',
    type: Number,
    required: false,
  })
  async findAll(
    @Param('filter_year') filter_year: string,
    @Query('from_date') from_date: string,
    @Query('to_date') to_date: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const response = await this.reportsService.findChildren(
      filter_year,
      from_date,
      to_date,
      month,
      year,
    );
    if (response.length > 0) {
      return {
        statusCode: 200,
        message: `Success.`,
        data: response,
      };
    } else {
      return {
        statusCode: 200,
        message: `No Data Found..`,
        data: [],
      };
    }
  }
}
