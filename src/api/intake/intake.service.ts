import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Equal, Repository, Raw, getManager } from 'typeorm';
import {
  CreateIntakeDto,
  UpdateIntakeDto,
  CreateReferralsDto,
  CreateAdditionalChildrenDto,
  UpdateAdditionalChildrenDto,
} from '../../dto';
import { IntakeEntity, AdditionalChildrenEntity } from '../../database';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class IntakeService {
  constructor(
    @InjectRepository(IntakeEntity)
    private intakeRepository: Repository<IntakeEntity>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @InjectRepository(AdditionalChildrenEntity)
    private addChildRepository: Repository<AdditionalChildrenEntity>,
  ) {}

  async isChildExistForReferrals(
    CreateReferralsDto: CreateReferralsDto,
  ): Promise<IntakeEntity[]> {
    return await this.intakeRepository.find({
      childName: CreateReferralsDto.childName,
      childLastName: CreateReferralsDto.childLastName,
      dateOfBirth: CreateReferralsDto.dateOfBirth,
      isActive: true,
      isDelete: false,
    });
  }

  async findEfcEmployee(id) {
    return await this.authService.isUserExistById(id);
  }

  public async addReferrals(
    createReferralsDto: CreateReferralsDto,
    ServiceCoordinator,
    EfcEmployee,
  ) {
    return this.intakeRepository.save({
      //child Details
      childName: createReferralsDto.childName,
      childMiddleName: createReferralsDto.childMiddleName,
      childLastName: createReferralsDto.childLastName,
      dateOfBirth: createReferralsDto.dateOfBirth,
      dateOfReceived: createReferralsDto.dateOfReceived,
      gender: createReferralsDto.gender,
      childDiagnosis: createReferralsDto.childDiagnosis,
      ethnicity: createReferralsDto.ethnicity,
      otherEthnicity: createReferralsDto.otherEthnicity,
      parentName: createReferralsDto.parentName,
      parentLastName: createReferralsDto.parentLastName,
      relationshipToChild: createReferralsDto.relationshipToChild,
      parentEmail: createReferralsDto.parentEmail,
      homePhnNo: createReferralsDto.homePhnNo,
      fluentInEng: createReferralsDto.fluentInEng,
      otherLang: createReferralsDto.otherLang,
      state: createReferralsDto.state,
      city: createReferralsDto.city,
      zipcode: createReferralsDto.zipcode,
      address: createReferralsDto.address,
      isReferal: createReferralsDto.isReferal,
      reasonForReferal: createReferralsDto.reasonForReferal,
      serviceCoordinator:
        createReferralsDto.isReferal === 'Yes' ? ServiceCoordinator : [],
      efcEmployee: EfcEmployee,
      addedBy: createReferralsDto.addedBy,
    });
  }

  public async findAll(id, role): Promise<IntakeEntity[]> {
    const query: any = this.intakeRepository
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
      .addSelect('createdAt', 'submitted_date')
      .leftJoinAndSelect('Intake.serviceCoordinator', 'serviceCoordinator')
      .leftJoinAndSelect('serviceCoordinator.agency', 'agency')
      .leftJoinAndSelect('Intake.efcEmployee', 'efcEmployee')
      .orderBy({ 'Intake.createdAt': 'ASC' })
      .where('Intake.isActive = :IsActive', {
        IsActive: true,
      });
    if (role.role == 'Efc Employee') {
      query.andWhere(`Intake.efcEmployee = :id`, { id: id });
    }
    if (role.role == 'Operator') {
      query.andWhere('Intake.addedBy =:id', { id: id });
    }
    //execute the query.
    return await query.getMany();
  }

  public async isChildExistByOtherId(
    id,
    updateIntakeDto: UpdateIntakeDto,
  ): Promise<IntakeEntity> {
    return await this.intakeRepository.findOne({
      isActive: true,
      isDelete: false,
      intakeId: Not(id),
      childName: updateIntakeDto.childName,
      childLastName: updateIntakeDto.childLastName,
      dateOfBirth: updateIntakeDto.dateOfBirth,
    });
  }

  public async update(
    intakeId: string,
    updateIntakeDto: UpdateIntakeDto,
    serviceCoordinator,
    efcEmployee,
  ) {
    return await this.intakeRepository.update(intakeId, {
      childName: updateIntakeDto.childName,
      childMiddleName: updateIntakeDto.childMiddleName,
      childLastName: updateIntakeDto.childLastName,
      gender: updateIntakeDto.gender,
      dateOfBirth: updateIntakeDto.dateOfBirth,
      dateOfReceived: updateIntakeDto.dateOfReceived,
      preSchool: updateIntakeDto.preSchool,
      dayCare: updateIntakeDto.dayCare,
      childDiagnosis: updateIntakeDto.childDiagnosis,
      ethnicity: updateIntakeDto.ethnicity,
      otherEthnicity: updateIntakeDto.otherEthnicity,
      fluentInEng: updateIntakeDto.fluentInEng,
      otherLang: updateIntakeDto.otherLang,
      parentName: updateIntakeDto.parentName,
      parentLastName: updateIntakeDto.parentLastName,
      relationshipToChild: updateIntakeDto.relationshipToChild,
      parentEmail: updateIntakeDto.parentEmail,
      address: updateIntakeDto.address,
      state: updateIntakeDto.state,
      city: updateIntakeDto.city,
      zipcode: updateIntakeDto.zipcode,
      homePhnNo: updateIntakeDto.homePhnNo,
      cellPhnNo: updateIntakeDto.cellPhnNo,
      workPhnNo: updateIntakeDto.workPhnNo,
      isReferal: updateIntakeDto.isReferal,
      reasonForReferal: updateIntakeDto.reasonForReferal,
      earlyStartServices: updateIntakeDto.earlyStartServices,
      otherRelevantInformation: updateIntakeDto.otherRelevantInformation,
      serviceCoordinator:
        updateIntakeDto.isReferal === 'Yes' ? serviceCoordinator : [],
      efcEmployee: efcEmployee,
    });
  }
  public async findById(id): Promise<IntakeEntity> {
    return await this.intakeRepository.findOne({
      intakeId: id,
      isActive: true,
    });
  }

  public async isAdditionalChildrenExist(
    data: CreateAdditionalChildrenDto,
  ): Promise<AdditionalChildrenEntity> {
    return await this.addChildRepository.findOne({
      relations: ['intake'],
      where: {
        childName: data.childName,
        isActive: true,
        intake: { intakeId: data.intakeId },
      },
    });
  }

  public async saveAdditionalChildren(data: CreateAdditionalChildrenDto) {
    return this.addChildRepository.save({
      childName: data.childName,
      childAge: data.childAge,
      intake: await this.findById(data.intakeId),
    });
  }

  public async findAdditionalChildren(
    id: string,
  ): Promise<AdditionalChildrenEntity[]> {
    return await this.addChildRepository.find({
      select: [
        'additionalChildrenId',
        'childName',
        'childAge',
        'isActive',
        'createdAt',
        'updatedAt',
      ],
      relations: ['intake'],
      where: {
        isActive: true,
        isDelete: false,
        intake: { intakeId: id },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async deleteAddChildren(id: string) {
    return this.addChildRepository.delete(id);
    // return this.addChildRepository.update(id, {
    //   isActive: false,
    //   isDelete: true,
    // });
  }

  async deleteChildren(id: string) {
    return this.intakeRepository.update(id, {
      isActive: false,
      isDelete: true,
    });
  }

  public async updateAdditionalChildren(
    id: string,
    data: UpdateAdditionalChildrenDto,
  ) {
    return this.addChildRepository.update(id, {
      childName: data.childName,
      childAge: data.childAge,
    });
  }

  async isAssignedOrNot(id: string) {
    return await this.intakeRepository.find({
      join: {
        alias: 'intake',
        leftJoinAndSelect: {
          efcEmployee: 'intake.efcEmployee',
        },
      },
      where: { isActive: true, efcEmployee: { userId: id } },
    });
  }

  public async isNotesExist(id): Promise<IntakeEntity> {
    return await this.intakeRepository.findOne({
      join: {
        alias: 'intake',
        leftJoinAndSelect: {
          childNotes: 'intake.childNotes',
        },
      },
      where: { isActive: true, intakeId: id },
    });
  }
}
