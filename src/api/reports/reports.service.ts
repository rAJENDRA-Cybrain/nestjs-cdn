import { AgeCalculator } from '@dipaktelangre/age-calculator';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import {
  ConversationTypeEntity,
  IntakeEntity,
  ManageChildNotesEntity,
  UserEntity,
} from '../../database';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(IntakeEntity)
    private intakeRepository: Repository<IntakeEntity>,
    @InjectRepository(ManageChildNotesEntity)
    private notesRepository: Repository<ManageChildNotesEntity>,
    @InjectRepository(ConversationTypeEntity)
    private conversationRepository: Repository<ConversationTypeEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findEmployeeReports(from_date, to_date) {
    const userData = await this.userRepository.find({
      where: {
        status: 'Active',
      },
      order: { createdAt: 'ASC' },
    });
    const convData = await this.conversationRepository.find({
      where: {
        isActive: true,
        options: true,
      },
      order: { createdAt: 'ASC' },
    });
    const finalResponseList = [];
    for (let i = 0; i < userData.length; i++) {
      let finalResponseObj = {};
      const conversations = [];
      finalResponseObj = {
        userId: userData[i].userId,
        firstName: userData[i].firstName,
        lastName: userData[i].lastName,
        emailId: userData[i].emailId,
        contactNo: userData[i].contactNo,
        conversations: conversations,
      };
      for (let j = 0; j < convData.length; j++) {
        let convType = {};
        const employeeNotes = await this.findEmployeeAddedNotes(
          userData[i].userId,
          convData[j].conversationTypeId,
          from_date,
          to_date,
        );
        convType = {
          conversationTypeId: convData[j].conversationTypeId,
          type: convData[j].type,
          description: convData[j].description,
          childNotes: employeeNotes,
        };
        if (Object.keys(convType).length > 0) {
          conversations.push(convType);
        }
      }
      if (Object.keys(finalResponseObj).length > 0) {
        finalResponseList.push(finalResponseObj);
      }
    }

    return finalResponseList;
  }

  async findEmployeeAddedNotes(user_id, convType_id, from_date, to_date) {
    const query = await this.notesRepository
      .createQueryBuilder('Notes')
      .select(['Notes'])
      .leftJoin('Notes.conversationType', 'conversationType')
      .leftJoin('Notes.intakeChild', 'intakeChild')
      .leftJoin('Notes.notesAddedBy', 'notesAddedBy')
      .orderBy({ 'Notes.createdAt': 'ASC' })
      .where(
        'Notes.isActive = :IsActive AND conversationType.conversationTypeId = :ConversationTypeId AND notesAddedBy.userId = :UserId',
        {
          IsActive: true,
          ConversationTypeId: convType_id,
          UserId: user_id,
        },
      );

    if ((from_date && to_date) != undefined) {
      query.andWhere(`Notes.createdAt BETWEEN '${from_date}' AND '${to_date}'`);
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
        'efcEmployee.contactNo',
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
      query.andWhere(
        `Intake.createdAt BETWEEN '${from_date}' AND '${to_date}'`,
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
}
