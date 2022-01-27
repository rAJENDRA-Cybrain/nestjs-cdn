import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { IntakeEntity } from '../../database';
import { AuthService } from '../auth/auth.service';
import { UpdateExitPlanDto } from '../../dto';
@Injectable()
export class ExitPlanService {
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
        'serviceCoordinator.agency',
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
      .orderBy({ 'Intake.dateOfReceived': 'DESC' })
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

  public async update(intakeId: string, dto: UpdateExitPlanDto) {
    return await this.intakeRepository.update(intakeId, {
      preSchool: dto.preSchool,
      dayCare: dto.dayCare,
      otherServices: dto.otherServices,
      tpEarlyStartFamillySpecialist: dto.tpEarlyStartFamillySpecialist,
      tpEarlyStartFamillySpecialistDate: dto.tpEarlyStartFamillySpecialistDate,
      tpQuestionToParentOneAns: dto.tpQuestionToParentOneAns,
      tpQuestionToParentTwoAns: dto.tpQuestionToParentTwoAns,
      tpQuestionToParentThirdAns: dto.tpQuestionToParentThirdAns,
      tpQuestionToParentThirdAAns: dto.tpQuestionToParentThirdAAns,
      tpQuestionToParentFourthAns: dto.tpQuestionToParentFourthAns,
      isEligibleForKERN: dto.isEligibleForKERN,
      epQuestionToParentOneAns: dto.epQuestionToParentOneAns,
      epQuestionToParentTwoAns: dto.epQuestionToParentTwoAns,
      epQuestionToParentThirdAns: dto.epQuestionToParentThirdAns,
      epQuestionToParentThirdAAns: dto.epQuestionToParentThirdAAns,
      epQuestionToParentFourthAns: dto.epQuestionToParentFourthAns,
      epExitReason: dto.epExitReason,
      epContinueStatus: dto.epContinueStatus,
      epCompletedDate: dto.epCompletedDate,
    });
  }
}
