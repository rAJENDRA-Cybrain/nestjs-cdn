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
  TriggerEmailDto,
} from '../../dto';
import { AuthService } from '../auth/auth.service';
import { sendEmail } from 'src/shared/node-mailer';
import { IntakeService } from '../intake/intake.service';

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
    // const query = await this.intakeRepository
    //   .createQueryBuilder('Intake')
    //   .leftJoinAndSelect('Intake.serviceCoordinator', 'serviceCoordinator')
    //   .leftJoinAndSelect('Intake.efcEmployee', 'efcEmployee')
    //   .orderBy({ 'Intake.createdAt': 'DESC' })
    //   .where('Intake.isActive = :IsActive', {
    //     IsActive: true,
    //   });
    // if (role.role == 'Efc Employee') {
    //   query.andWhere(`Intake.efcEmployee: Equal(${userId})`);
    // }
    // if (role.role == 'Operator') {
    //   query.andWhere('Intake.addedBy =:id', { id: userId });
    // }
    // if ((intake_start_date && intake_end_date) != undefined) {
    //   query.andWhere(
    //     `Intake.createdAt BETWEEN '${intake_start_date}' AND '${intake_end_date}'`,
    //   );
    // }
    //return await query.getMany();
    if (role.role == 'Super Admin') {
      return await this.intakeRepository.find({
        relations: ['serviceCoordinator', 'efcEmployee'],
        where: { isActive: true },
        order: {
          createdAt: 'DESC',
        },
      });
    }
    if (role.role == 'Efc Employee') {
      return await this.intakeRepository.find({
        relations: ['serviceCoordinator', 'efcEmployee'],
        where: { isActive: true, efcEmployee: Equal(userId) },
        order: {
          createdAt: 'DESC',
        },
      });
    }
    if (role.role == 'Operator') {
      return await this.intakeRepository.find({
        relations: ['serviceCoordinator', 'efcEmployee'],
        where: { isActive: true, addedBy: Equal(userId) },
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
    for (let i = 0; i < req.body['intakes'].length; i++) {
      const mailOptions = {
        email: req.body['intakes'][i]['parentEmail'],
        subject: req.body.templateSubject,
        body: req.body.templateBody,
        attachments: req.body['templateAttachments'],
      };
      await sendEmail(smtp, mailOptions);
      await this.createEmailLogs(
        req.body['intakes'][i]['intakeId'],
        smtp,
        mailOptions,
      );
    }
    return true;
  }

  async createEmailLogs(intakeId, smtp, mailOptions) {
    return await this.emailLogsRepository.save({
      intake: await this.intakeService.findById(intakeId),
      emailLogSmtpId: smtp.smtpId,
      emailLogSmtpUserName: smtp.smtpUserName,
      emailLogSmtpDisplayName: smtp.smtpDisplayName,
      emailLogTo: mailOptions.email,
      emailLogSubject: mailOptions.subject,
      emailLogBody: mailOptions.body,
      emailLogAttachments: mailOptions.attachments,
    });
  }

  async findTriggeredEmailToAChild(intakeId) {
    return await this.emailLogsRepository
      .createQueryBuilder('emailLogs')
      .select(['emailLogs'])
      .innerJoin('emailLogs.intake', 'intake')
      .where('intake.intakeId = :intakeId', { intakeId: intakeId })
      .orderBy({ 'emailLogs.createdAt': 'DESC' })
      .getMany();
  }
}
