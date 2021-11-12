import { AgeCalculator } from '@dipaktelangre/age-calculator';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Repository } from 'typeorm';
import {
  ConversationTypeEntity,
  IntakeEntity,
  ManageChildNotesEntity,
  UserEntity,
  ReportsGeneratedEntity,
} from '../../database';
import { GenerateHtmlToPdf } from '../../dto';
import * as puppeteer from 'puppeteer';
import { Readable } from 'stream';
import { AuthService } from '../auth/auth.service';

export interface PDFRenderOptions {
  page: {
    format?: puppeteer.PaperFormat;
    landscape?: boolean;
    height?: puppeteer.PaperFormatDimensions['height'];
    width?: puppeteer.PaperFormatDimensions['width'];
    path?: string;
  };
  screen?: boolean;
}

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(IntakeEntity)
    private intakeRepository: Repository<IntakeEntity>,
    @InjectRepository(ConversationTypeEntity)
    private conversationRepository: Repository<ConversationTypeEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ReportsGeneratedEntity)
    private reportGenerateRepository: Repository<ReportsGeneratedEntity>,
    private authService: AuthService,
  ) {}

  async findEmployeeReports(from_date, to_date, user_ids) {
    const userData = await this.userRepository.find({
      select: ['userId', 'firstName', 'lastName', 'emailId'],
      where: user_ids
        ? {
            status: 'Active',
            userId: In(user_ids.split(',')),
          }
        : {
            status: 'Active',
          },
      order: { createdAt: 'ASC' },
    });

    for (let i = 0; i < userData.length; i++) {
      userData[i]['reports'] = await this.findConversationsWiseNotes(
        userData[i].userId,
        from_date,
        to_date,
      );
    }
    const filteredData = userData.filter(function (el) {
      return el['reports'].length > 0;
    });
    if (filteredData.length > 0) {
      return filteredData;
    } else {
      return [];
    }
  }

  async findConversationsWiseNotes(id, from_date, to_date) {
    const query = await this.conversationRepository
      .createQueryBuilder('coversationType')
      .select([
        'coversationType.conversationTypeId',
        'coversationType.type',
        'coversationType.description',
        'childNotes',
        'intakeChild',
      ])
      .leftJoin('coversationType.conversations', 'childNotes')
      .leftJoin('childNotes.notesAddedBy', 'notesAddedBy')
      .leftJoin('childNotes.intakeChild', 'intakeChild')
      .orderBy({ 'childNotes.createdAt': 'ASC' })
      .where(
        'coversationType.isActive = :IsActive AND notesAddedBy.userId = :UserId AND childNotes.isActive = :NotesIsActive',
        {
          IsActive: true,
          NotesIsActive: true,
          UserId: id,
        },
      );
    if ((from_date && to_date) != undefined) {
      query
        .andWhere(
          `
          DATE_TRUNC('day', "childNotes"."createdAt") >= :begin`,
          {
            begin: from_date,
          },
        )
        .andWhere(
          `
          DATE_TRUNC('day', "childNotes"."createdAt")  <= :end`,
          {
            end: to_date,
          },
        );
    }
    return await query.getMany();
  }

  async findChildren(filter_year, from_date, to_date, month, year) {
    const query = await this.intakeRepository
      .createQueryBuilder('Intake')
      .select([
        'Intake',
        'serviceCoordinator.serviceCoordinatorId',
        'serviceCoordinator.name',
        'serviceCoordinator.agency',
        'serviceCoordinator.phoneNo',
        'serviceCoordinator.emailId',
        'efcEmployee.userId',
        'efcEmployee.firstName',
        'efcEmployee.lastName',
        'efcEmployee.emailId',
        'additionalChild.additionalChildrenId',
        'additionalChild.childName',
        'additionalChild.childAge',
        'additionalChild.createdAt',
        'childNotes.notesId',
        'childNotes.date',
        'childNotes.timestamp',
        'childNotes.notes',
        'childNotes.createdAt',
      ])
      .leftJoin('Intake.serviceCoordinator', 'serviceCoordinator')
      .leftJoin('Intake.efcEmployee', 'efcEmployee')
      .leftJoin('Intake.additionalChild', 'additionalChild')
      .leftJoin('Intake.childNotes', 'childNotes')
      .orderBy({ 'Intake.createdAt': 'ASC' })
      .where('Intake.isActive = :IsActive', {
        IsActive: true,
      });
    if ((from_date && to_date) != undefined) {
      query
        .andWhere(
          `
            DATE_TRUNC('day', "Intake"."createdAt") >= :begin`,
          {
            begin: from_date,
          },
        )
        .andWhere(
          `
            DATE_TRUNC('day', "Intake"."createdAt")  <= :end`,
          {
            end: to_date,
          },
        );
    }
    if (year !== undefined) {
      if (month == 0) {
        query.andWhere(`date_part('year', Intake.createdAt) = '${year}'`);
      } else {
        query.andWhere(
          `date_part('year', Intake.createdAt) = '${year}' AND date_part('month', Intake.createdAt) = '${month}' `,
        );
      }
    }
    const data = await query.getMany();
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        data[i]['age'] = AgeCalculator.getAge(new Date(data[i].dateOfBirth));
      }
      const filteredData = data.filter(function (el) {
        if (filter_year == '2.6') {
          return el['age']['years'] <= 2 && el['age']['months'] > 5;
        } else {
          return el['age']['years'] >= 3;
        }
      });
      return filteredData;
    } else {
      return [];
    }
  }

  async renderPdfFromHtml(html: string, options?: PDFRenderOptions) {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 0 });
    if (options) {
      await page.emulateMediaType(options.screen ? 'screen' : 'print');
    }
    const pdfContent = await page.pdf(options.page);
    await browser.close();
    return pdfContent;
  }

  async addGeneratedFileData(userId, Result, data: GenerateHtmlToPdf) {
    return await this.reportGenerateRepository.save({
      fromDate: data.from_Date,
      toDate: data.to_Date,
      fileLink: Result.path,
      reportGeneratedBy: await this.authService.isUserExistById(userId),
    });
  }

  async findEmployeeReportsToDownloadFile() {
    return await this.reportGenerateRepository
      .createQueryBuilder('reports')
      .select([
        'reports.reportsId',
        'reports.fromDate',
        'reports.toDate',
        'reports.fileLink',
        'reports.reportGeneratedBy',
        'reports.isActive',
        'reports.createdAt',
        'reports.updatedAt',
        'reportGeneratedBy.firstName',
        'reportGeneratedBy.lastName',
      ])
      .leftJoin('reports.reportGeneratedBy', 'reportGeneratedBy')
      .orderBy({ 'reports.updatedAt': 'ASC' })
      .getMany();
  }
}
