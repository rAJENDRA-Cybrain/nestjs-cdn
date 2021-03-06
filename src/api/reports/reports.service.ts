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
    let userData = [];
    if (user_ids) {
      userData = await this.userRepository.find({
        select: ['userId', 'firstName', 'lastName', 'emailId'],
        where: {
          status: 'Active',
          userId: In(user_ids.split(',')),
        },
        order: { createdAt: 'ASC' },
      });
    }

    for (let i = 0; i < userData.length; i++) {
      const [report, ff, tp, tRef, tComp] = await Promise.all([
        await this.findEmpConversation(userData[i].userId, from_date, to_date),
        await this.findConversationsWiseNotes(
          userData[i].userId,
          '908fdda9-7cce-4f5a-be80-30907ca65feb',
          from_date,
          to_date,
        ),
        await this.findConversationsWiseNotes(
          userData[i].userId,
          '7f89f393-018a-4a33-ad25-cb7e15d81467',
          from_date,
          to_date,
        ),
        await this.findTotalIntakeReferal(
          userData[i].userId,
          from_date,
          to_date,
        ),
        await this.findTotalIntakeCompleted(
          userData[i].userId,
          from_date,
          to_date,
        ),
      ]);
      userData[i]['report'] = report;
      userData[i]['Employee Name'] =
        userData[i].firstName + ' ' + userData[i].lastName;
      userData[i]['HOW MANY NEW REFERRALS DID YOU RECEIVE?'] = tRef.length;
      userData[i][
        'HOW MANY NEW FAMILIES DID YOU HAVE CONTACT WITH FACE TO FACE'
      ] = ff[0]?.conversations ? ff[0]?.conversations?.length : 0;
      userData[i][
        'HOW MANY FAMILIES DID YOU HAVE CONTACT WITH OVER THE PHONE'
      ] = tp[0]?.conversations ? tp[0]?.conversations?.length : 0;
      userData[i]['HOW MANY INTAKES DID YOU COMPLETE?'] = tComp.length;

      delete userData[i].lastName;
      delete userData[i].firstName;
      delete userData[i].userId;
    }

    if (userData.length > 0) {
      return userData;
    } else {
      return [];
    }
  }

  async findEmpConversation(id, from_date, to_date) {
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

  async findConversationsWiseNotes(id, convTypeId, from_date, to_date) {
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
        'coversationType.isActive = :IsActive AND coversationType.conversationTypeId = :convTypeId  AND notesAddedBy.userId = :UserId AND childNotes.isActive = :NotesIsActive',
        {
          IsActive: true,
          NotesIsActive: true,
          UserId: id,
          convTypeId: convTypeId,
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

  async findTotalIntakeReferal(userId, from_date, to_date) {
    const query = await this.intakeRepository
      .createQueryBuilder('Intake')
      .select([
        'Intake',
        'efcEmployee.userId',
        'efcEmployee.firstName',
        'efcEmployee.lastName',
        'efcEmployee.emailId',
      ])
      .leftJoin('Intake.efcEmployee', 'efcEmployee')
      .orderBy({ 'Intake.createdAt': 'ASC' })
      .where('Intake.isActive = :IsActive AND efcEmployee.userId = :userId', {
        IsActive: true,
        userId: userId,
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

    return await query.getMany();
  }

  async findTotalIntakeCompleted(userId, from_date, to_date) {
    const query = await this.intakeRepository
      .createQueryBuilder('Intake')
      .select([
        'Intake',
        'efcEmployee.userId',
        'efcEmployee.firstName',
        'efcEmployee.lastName',
        'efcEmployee.emailId',
      ])
      .leftJoin('Intake.efcEmployee', 'efcEmployee')
      .orderBy({ 'Intake.createdAt': 'ASC' })
      .where(
        'Intake.isActive = :IsActive AND efcEmployee.userId = :userId AND Intake.epContinueStatus = :status',
        {
          IsActive: true,
          userId: userId,
          status: 'No',
        },
      );
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
      .where('reports.isActive = :IsActive', {
        IsActive: true,
      })
      .getMany();
  }

  async archiveReportFile(id: string) {
    return await this.reportGenerateRepository.update(id, {
      isActive: false,
    });
  }
}
