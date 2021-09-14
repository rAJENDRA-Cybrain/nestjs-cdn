import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
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
    if (role.role == 'Operator') {
      return await getManager().query(
        `
      SELECT age("dateOfBirth"),"tbl_CRMIntake".*,"tbl_CRMServiceCordinator"."serviceCoordinatorId",
      "tbl_CRMServiceCordinator"."name" as serviceCoordinator FROM "tbl_CRMIntake"
      INNER JOIN "tbl_CRMServiceCordinator" ON "tbl_CRMServiceCordinator"."serviceCoordinatorId" = "tbl_CRMIntake"."serviceCoordinatorId"
      Where "tbl_CRMIntake"."isActive" = true  AND "tbl_CRMIntake"."addedBy" = '${id}'
      Order By  "tbl_CRMIntake"."createdAt"  DESC
      `,
      );
    } else if (role.role == 'Efc Employee') {
      return await getManager().query(
        `
      SELECT age("dateOfBirth"),"tbl_CRMIntake".*,"tbl_CRMServiceCordinator"."serviceCoordinatorId",
      "tbl_CRMServiceCordinator"."name" as serviceCoordinator FROM "tbl_CRMIntake"
      INNER JOIN "tbl_CRMServiceCordinator" ON "tbl_CRMServiceCordinator"."serviceCoordinatorId" = "tbl_CRMIntake"."serviceCoordinatorId"
      Where "tbl_CRMIntake"."isActive" = true AND "tbl_CRMIntake"."userId" = '${id}'
      Order By  "tbl_CRMIntake"."createdAt"  DESC
      `,
      );
    } else {
      return await getManager().query(
        `
      SELECT age("dateOfBirth"),"tbl_CRMIntake".*,
      "tbl_CRMServiceCordinator"."serviceCoordinatorId","tbl_CRMServiceCordinator"."name" as serviceCoordinator
      FROM "tbl_CRMIntake"
      INNER JOIN "tbl_CRMServiceCordinator" ON "tbl_CRMServiceCordinator"."serviceCoordinatorId" = "tbl_CRMIntake"."serviceCoordinatorId"
      Where "tbl_CRMIntake"."isActive" = true 
      Order By  "tbl_CRMIntake"."createdAt"  DESC
      `,
      );
    }
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