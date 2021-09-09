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

  public async findChildren(id: string): Promise<IntakeEntity[]> {
    const user = await this.authService.findRoleByUserId(id);
    if (user.role.role == 'Operator') {
      return await getManager().query(
        `
      SELECT age("dateOfBirth"),"tbl_CRMIntake".*,"tbl_CRMServiceCordinator"."serviceCoordinatorId",
      "tbl_CRMServiceCordinator"."name" as serviceCoordinator FROM "tbl_CRMIntake"
      INNER JOIN "tbl_CRMServiceCordinator" ON "tbl_CRMServiceCordinator"."serviceCoordinatorId" = "tbl_CRMIntake"."serviceCoordinatorId"
      Where "tbl_CRMIntake"."isActive" = true  AND "tbl_CRMIntake"."addedBy" = '${id}'
      Order By  "tbl_CRMIntake"."createdAt"  DESC
      `,
      );
    } else if (user.role.role == 'Efc Employee') {
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

  public async update(intakeId: string, dto: UpdateExitPlanDto) {
    return await this.intakeRepository.update(intakeId, {
      epContinueStatus: dto.epContinueStatus,
      epCompletedDate: dto.epCompletedDate,
    });
  }
}
