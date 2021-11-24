import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Version,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ReportsService } from './reports.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  QueryGenerateReportDto,
  QueryReportYearWiseDto,
  GenerateHtmlToPdf,
} from '../../dto';
import { AuthGuard } from '@nestjs/passport';

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
  @ApiOperation({ summary: 'Generate report with time interval' })
  async generateNewReports(@Query() query: QueryGenerateReportDto) {
    const response = await this.reportsService.findEmployeeReports(
      query.from_date,
      query.to_date,
      query.user_ids,
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

  @Get('generate/files-to-download')
  @Version('1')
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @ApiOperation({ summary: 'Generated reports file' })
  async generateNewReportsFile() {
    const response =
      await this.reportsService.findEmployeeReportsToDownloadFile();

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
  @ApiOperation({ summary: 'Report 2.6 years and 3 years childrens' })
  async findAll(
    @Param('filter_year') filter_year: string,
    @Query() query: QueryReportYearWiseDto,
  ) {
    const response = await this.reportsService.findChildren(
      filter_year,
      query.from_date,
      query.to_date,
      query.month,
      query.year,
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

  @Post('render-html-to-pdf')
  @Version('1')
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  @ApiOperation({ summary: '' })
  @UseGuards(AuthGuard('jwt'))
  async postRenderFromHtml(
    @Req() req: Request,
    @Res() res: Response,
    @Body() data: GenerateHtmlToPdf,
  ) {
    //console.log(data);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    data.options.page.path = `./webroot/html-to-pdf/${randomName}.pdf`;
    const buffer = await this.reportsService.renderPdfFromHtml(
      data.html,
      data.options,
    );
    const Result = {
      filename: `${randomName}.pdf`,
      mimeType: 'application/pdf',
      path:
        req.protocol +
        '://' +
        req.get('host') +
        `/html-to-pdf/${randomName}.pdf`,
      content: buffer.toString('base64'),
    };
    if (buffer) {
      await this.reportsService.addGeneratedFileData(
        req.user['payload'].userId,
        Result,
        data,
      );
    }
    res.setHeader('Content-Type', 'application/json;charset=UTF-8');
    res.status(200).send(Result);
  }
}
