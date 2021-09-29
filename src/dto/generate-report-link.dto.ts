import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import * as puppeteer from 'puppeteer';

export class QueryGenerateReportDto {
  @ApiPropertyOptional({ default: '' })
  from_date: string;

  @ApiPropertyOptional({ default: '' })
  to_date: string;
}

export class QueryReportYearWiseDto {
  @ApiPropertyOptional({ default: '' })
  from_date: string;

  @ApiPropertyOptional({ default: '' })
  to_date: string;

  @ApiPropertyOptional({ default: '' })
  year: string;

  @ApiPropertyOptional({ default: '' })
  month: string;
}

export class PageOptions {
  @ApiProperty({
    default: 'a4',
  })
  format: puppeteer.PaperFormat;
  @ApiProperty({
    default: true,
  })
  landscape: boolean;
  @ApiProperty({
    default: 'null',
  })
  height?: puppeteer.PaperFormatDimensions['height'];
  @ApiProperty({
    default: 'null',
  })
  width?: puppeteer.PaperFormatDimensions['width'];
  path?: string;
}
export class PdfOptions {
  @ApiProperty()
  page: PageOptions;
  @ApiProperty({ default: true })
  screen: boolean;
}
export class GenerateHtmlToPdf {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: '' })
  from_Date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: '' })
  to_Date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: '' })
  html: string;

  @ApiProperty({ default: true })
  json: boolean;

  @ApiProperty()
  options: PdfOptions;
}
