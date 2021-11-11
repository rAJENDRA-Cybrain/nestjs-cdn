import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntakeEntity } from '../../database';
import { AuthService } from '../auth/auth.service';
import { UpdateTransitionPlanDto } from '../../dto';
@Injectable()
export class TransitionPlanService {
  constructor(
    @InjectRepository(IntakeEntity)
    private intakeRepository: Repository<IntakeEntity>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  public async findChildren(id: string, role: any): Promise<IntakeEntity[]> {
    const query: any = await this.intakeRepository
      .createQueryBuilder('Intake')
      .select([
        'Intake',
        'serviceCoordinator.serviceCoordinatorId',
        'serviceCoordinator.name',
        'serviceCoordinator.phoneNo',
        'serviceCoordinator.emailId',
        'efcEmployee.userId',
        'efcEmployee.firstName',
        'efcEmployee.lastName',
        'efcEmployee.emailId',
      ])
      .leftJoinAndSelect('Intake.serviceCoordinator', 'serviceCoordinator')
      .leftJoinAndSelect('serviceCoordinator.agency', 'agency')
      .leftJoin('Intake.efcEmployee', 'efcEmployee')
      .orderBy({ 'Intake.createdAt': 'DESC' })
      .where('Intake.isActive = :IsActive', {
        IsActive: true,
      });
    if (role.role == 'Efc Employee') {
      query.andWhere(`Intake.efcEmployee = :id`, { id: id });
    }
    if (role.role == 'Operator') {
      query.andWhere('Intake.addedBy =:id', { id: id });
    }
    return await query.getMany();
  }

  public async update(intakeId: string, dto: UpdateTransitionPlanDto) {
    return await this.intakeRepository.update(intakeId, {
      preSchool: dto.preSchool,
      dayCare: dto.dayCare,
      tpQuestionToParentOneAns: dto.tpQuestionToParentOneAns,
      tpQuestionToParentTwoAns: dto.tpQuestionToParentTwoAns,
      tpQuestionToParentThirdAns: dto.tpQuestionToParentThirdAns,
      tpEarlyStartFamillySpecialist: dto.tpEarlyStartFamillySpecialist,
      tpEarlyStartFamillySpecialistDate: dto.tpEarlyStartFamillySpecialistDate,
      tpCompletedDate: dto.tpCompletedDate,
    });
  }
}
