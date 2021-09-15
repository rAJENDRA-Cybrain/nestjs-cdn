import { AgeCalculator } from '@dipaktelangre/age-calculator';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntakeEntity } from '../../database';
import { AuthService } from '../auth/auth.service';
import { Intake } from '../../shared/intake.model';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(IntakeEntity)
    private intakeRepository: Repository<IntakeEntity>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async findChildren(filter_year, from_date, to_date, month, year) {
    console.log(
      'Service End Data',
      filter_year,
      from_date,
      to_date,
      month,
      year,
    );
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
