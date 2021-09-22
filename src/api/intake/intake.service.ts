import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Equal, Repository, Raw, getManager } from 'typeorm';
import {
  CreateIntakeDto,
  UpdateIntakeDto,
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
  async isChildExist(
    createIntakeDto: CreateIntakeDto,
  ): Promise<IntakeEntity[]> {
    return await this.intakeRepository.find({
      childName: createIntakeDto.childName,
      parentName: createIntakeDto.parentName,
      dateOfBirth: createIntakeDto.dateOfBirth,
      isActive: true,
      isDelete: false,
    });
  }

  async findEfcEmployee(id) {
    return await this.authService.isUserExistById(id);
  }
  public async save(createIntakeDto: CreateIntakeDto, servCord, efcEmployee) {
    return this.intakeRepository.save({
      childName: createIntakeDto.childName,
      dateOfBirth: createIntakeDto.dateOfBirth,
      dateOfReceived: createIntakeDto.dateOfReceived,
      preSchool: createIntakeDto.preSchool,
      dayCare: createIntakeDto.dayCare,
      childDiagnosis: createIntakeDto.childDiagnosis,
      ethnicity: createIntakeDto.ethnicity,
      otherEthnicity: createIntakeDto.otherEthnicity,
      fluentInEng: createIntakeDto.fluentInEng,
      otherLang: createIntakeDto.otherLang,
      parentName: createIntakeDto.parentName,
      parentLastName: createIntakeDto.parentLastName,
      relationshipToChild: createIntakeDto.relationshipToChild,
      parentEmail: createIntakeDto.parentEmail,
      address: createIntakeDto.address,
      city: createIntakeDto.city,
      zipcode: createIntakeDto.zipcode,
      homePhnNo: createIntakeDto.homePhnNo,
      cellPhnNo: createIntakeDto.cellPhnNo,
      workPhnNo: createIntakeDto.workPhnNo,
      isReferal: createIntakeDto.isReferal,
      reasonForReferal: createIntakeDto.reasonForReferal,
      earlyStartServices: createIntakeDto.earlyStartServices,
      otherRelevantInformation: createIntakeDto.otherRelevantInformation,
      serviceCoordinator: servCord,
      efcEmployee: efcEmployee,
      addedBy: createIntakeDto.addedBy,
    });
  }

  public async findAll(): Promise<IntakeEntity[]> {
    return await this.intakeRepository
      .createQueryBuilder('intake')
      .select([
        'intake',
        'serCoordinator.serviceCoordinatorId',
        'serCoordinator.name',
        'serCoordinator.agency',
        'serCoordinator.phoneNo',
        'serCoordinator.emailId',
        'efcEmployee.userId',
        'efcEmployee.firstName',
        'efcEmployee.lastName',
        'efcEmployee.emailId',
        'efcEmployee.contactNo',
      ])
      .leftJoin('intake.serviceCoordinator', 'serCoordinator')
      .leftJoin('intake.efcEmployee', 'efcEmployee')
      .where('intake.isActive = :isActive AND intake.isDelete = :isDelete', {
        isActive: true,
        isDelete: false,
      })
      .orderBy({ 'intake.createdAt': 'DESC' })
      .getMany();
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
      parentName: updateIntakeDto.parentName,
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
      city: updateIntakeDto.city,
      zipcode: updateIntakeDto.zipcode,
      homePhnNo: updateIntakeDto.homePhnNo,
      cellPhnNo: updateIntakeDto.cellPhnNo,
      workPhnNo: updateIntakeDto.workPhnNo,
      isReferal: updateIntakeDto.isReferal,
      reasonForReferal: updateIntakeDto.reasonForReferal,
      earlyStartServices: updateIntakeDto.earlyStartServices,
      otherRelevantInformation: updateIntakeDto.otherRelevantInformation,
      serviceCoordinator: serviceCoordinator,
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
