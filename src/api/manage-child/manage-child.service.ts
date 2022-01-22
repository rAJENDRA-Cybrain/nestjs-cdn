import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import {
  ManageChildNotesEntity,
  IntakeEntity,
  UserEntity,
  EmailLogsEntity,
} from '../../database';
import {
  CreateManageChildNotesDto,
  UpdateManageChildNotesDto,
} from '../../dto';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { AuthService } from '../auth/auth.service';
import { sendEmail } from 'src/shared/node-mailer';
import { IntakeService } from '../intake/intake.service';
import { SmtpDetailsService } from '../smtp-details/smtp-details.service';

@Injectable()
export class ManageChildService {
  constructor(
    @InjectRepository(ManageChildNotesEntity)
    private notesRepository: Repository<ManageChildNotesEntity>,
    @InjectRepository(IntakeEntity)
    private intakeRepository: Repository<IntakeEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(EmailLogsEntity)
    private emailLogsRepository: Repository<EmailLogsEntity>,
    @Inject(forwardRef(() => IntakeService))
    private intakeService: IntakeService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private schedulerRegistry: SchedulerRegistry,
    private readonly smtpDetailsService: SmtpDetailsService,
  ) {}

  async findChild(
    userId: string,
    role: any,
    child_name: string,
    dob: string,
    relation: string,
    diagnosis: string,
    intake_start_date: string,
    intake_end_date: string,
  ) {
    if (role.role == 'Super Admin') {
      return await this.intakeRepository.find({
        relations: [
          'serviceCoordinator',
          'serviceCoordinator.agency',
          'efcEmployee',
        ],
        where: { isActive: true },
        order: {
          createdAt: 'DESC',
        },
      });
    }
    if (role.role == 'Efc Employee') {
      return await this.intakeRepository.find({
        relations: [
          'serviceCoordinator',
          'serviceCoordinator.agency',
          'efcEmployee',
        ],
        where: { isActive: true, efcEmployee: Equal(userId) },
        order: {
          createdAt: 'DESC',
        },
      });
    }
    if (role.role == 'Operator') {
      return await this.intakeRepository.find({
        relations: [
          'serviceCoordinator',
          'serviceCoordinator.agency',
          'efcEmployee',
        ],
        where: { isActive: true, addedBy: Equal(userId) },
        order: {
          createdAt: 'DESC',
        },
      });
    }
  }

  async findArchivedChild(userId: string, role: any) {
    if (role.role == 'Super Admin') {
      return await this.intakeRepository.find({
        relations: [
          'serviceCoordinator',
          'serviceCoordinator.agency',
          'efcEmployee',
        ],
        where: { isActive: false, isDelete: false },
        order: {
          createdAt: 'DESC',
        },
      });
    }
    if (role.role == 'Efc Employee') {
      return await this.intakeRepository.find({
        relations: [
          'serviceCoordinator',
          'serviceCoordinator.agency',
          'efcEmployee',
        ],
        where: { isActive: false, isDelete: false, efcEmployee: Equal(userId) },
        order: {
          createdAt: 'DESC',
        },
      });
    }
    if (role.role == 'Operator') {
      return await this.intakeRepository.find({
        relations: [
          'serviceCoordinator',
          'serviceCoordinator.agency',
          'efcEmployee',
        ],
        where: { isActive: false, isDelete: false, addedBy: Equal(userId) },
        order: {
          createdAt: 'DESC',
        },
      });
    }
  }

  public async save(
    createNotesDto: CreateManageChildNotesDto,
    convData,
    childData,
    userData,
  ) {
    return this.notesRepository.save({
      conversationType: convData,
      date: createNotesDto.date,
      timestamp: createNotesDto.timestamp,
      notes: createNotesDto.notes,
      intakeChild: childData,
      notesAddedBy: userData,
    });
  }

  public async findNotes(intakeId: string): Promise<any> {
    return await this.intakeRepository
      .createQueryBuilder('intake')
      .innerJoinAndSelect(
        'intake.childNotes',
        'childNotes',
        'childNotes.isActive = :isActive',
        { isActive: true },
      )
      .innerJoinAndSelect('childNotes.conversationType', 'conversationType')
      .innerJoinAndSelect('childNotes.notesAddedBy', 'notesAddedBy')
      .where('intake.intakeId = :intakeId', { intakeId: intakeId })
      .orderBy({ 'childNotes.createdAt': 'DESC' })
      .getOne();
  }

  public async update(
    notesId: string,
    dto: UpdateManageChildNotesDto,
    convData,
  ) {
    return await this.notesRepository.update(notesId, {
      conversationType: convData,
      timestamp: dto.timestamp,
      notes: dto.notes,
      date: dto.date,
    });
  }

  async updateStatus(id: string) {
    return await this.notesRepository.update(id, {
      isActive: false,
    });
  }

  async findReport() {
    return await this.notesRepository.find({ relations: ['notesAddedBy'] });
  }

  async triggerMail(req, files, smtp) {
    if (Object.keys(files).length > 0) {
      for (let i = 0; i < files.length; i++) {
        let templateAttachmentsObj = {};
        templateAttachmentsObj = {
          filename: files[i].originalname,
          path:
            req.protocol +
            '://' +
            req.get('host') +
            `/uploads/email-attachments/${files[i].filename}`,
        };
        if (Object.keys(templateAttachmentsObj).length > 0) {
          req.body['templateAttachments'].push(templateAttachmentsObj);
        }
      }
    }

    const batch = Math.floor(Math.random() * 1000000 + 1);

    for (let i = 0; i < req.body['intakes'].length; i++) {
      const mailOptions = {
        email: req.body['intakes'][i]['parentEmail'],
        replyTo: req.body['intakes'][i]['efcEmployee_email'],
        subject: req.body.templateSubject,
        body: req.body.templateBody,
        attachments: req.body['templateAttachments'],
      };
      await this.createEmailLogs(
        req.body['intakes'][i]['intakeId'],
        smtp,
        mailOptions,
        batch,
        req.body.userId,
      );
    }
    await this.triggerCronJob('bulk-email');
    return batch;
  }

  async createEmailLogs(intakeId, smtp, mailOptions, batch, userId) {
    return await this.emailLogsRepository.save({
      intake: await this.intakeService.findById(intakeId),
      emailLogSmtpId: smtp.smtpId,
      emailLogSmtpUserName: smtp.smtpUserName,
      emailLogSmtpDisplayName: smtp.smtpDisplayName,
      emailLogTo: mailOptions.email,
      emailLogreplyTo: mailOptions.replyTo,
      emailLogSubject: mailOptions.subject,
      emailLogBody: mailOptions.body,
      emailLogAttachments: mailOptions.attachments,
      batch: batch,
      addedBy: userId,
    });
  }

  async findTriggeredEmailToAChild(intakeId) {
    const data = await this.emailLogsRepository
      .createQueryBuilder('emailLogs')
      .select(['emailLogs'])
      .innerJoin('emailLogs.intake', 'intake')
      .where('intake.intakeId = :intakeId', { intakeId: intakeId })
      .orderBy({ 'emailLogs.createdAt': 'DESC' })
      .getMany();

    for (let index = 0; index < data.length; index++) {
      const user = await this.authService.isUserExistById(data[index].addedBy);
      data[index]['user'] = user?.firstName + ' ' + user?.lastName || '';
    }

    return data;
  }

  async updateEmailLogsStatus(logId: string) {
    await this.emailLogsRepository.update(logId, {
      isSent: true,
    });
  }

  async findMailActiveList(userId: string) {
    const batches = await this.emailLogsRepository
      .createQueryBuilder('emailLogs')
      .select('DISTINCT ("batch")')
      .where('emailLogs.addedBy = :addedBy', { addedBy: userId })
      .getRawMany();

    if (batches.length > 0) {
      for (let index = 0; index < batches.length; index++) {
        const count = await this.emailLogsRepository
          .createQueryBuilder('emailLogs')
          .where(
            'emailLogs.addedBy = :addedBy AND emailLogs.batch = :batch AND emailLogs.isSent = :isSent AND emailLogs.isDelete = :isDelete',
            {
              isSent: false,
              isDelete: false,
              batch: batches[index].batch,
              addedBy: userId,
            },
          )
          .getMany();

        batches[index]['total_emails'] = count.length > 0 ? count.length : 0;
      }
    }
    return batches;
  }

  @Cron(CronExpression.EVERY_MINUTE, { name: 'bulk-email' })
  async handleCron() {
    console.log('CRON JOB STARTED');
    const email_log = await this.emailLogsRepository.find({
      where: { isDelete: false, isSent: false },
      order: {
        createdAt: 'ASC',
      },
      take: 3,
    });

    if (email_log.length > 0) {
      const smtp = await this.smtpDetailsService.findActiveSmtp();
      for (let i = 0; i < email_log.length; i++) {
        console.log(email_log[i]);
        const mailOptions = {
          email: email_log[i]['emailLogTo'],
          replyTo: email_log[i]['emailLogreplyTo'],
          subject: email_log[i]['emailLogSubject'],
          body: email_log[i]['emailLogBody'],
          attachments:
            email_log[i]['emailLogAttachments'].length > 0
              ? JSON.parse(email_log[i]['emailLogAttachments'] as any)
              : [],
        };
        await sendEmail(smtp, mailOptions);
        await this.updateEmailLogsStatus(email_log[i]['emailLogId']);
      }
    } else {
      await this.stopCronJob('bulk-email');
    }
  }

  async triggerCronJob(id: string) {
    const job = this.schedulerRegistry.getCronJob(id);
    job.start();
    console.log('CROn Job Triggered');
  }

  async stopCronJob(id: string) {
    const job = this.schedulerRegistry.getCronJob(id);
    job.stop();
    console.log('CRON JOB STOPED');
  }
}
