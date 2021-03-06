import { ConflictException, Injectable } from '@nestjs/common';
import {
  CreateServiceCoordinatorDto,
  UpdateServiceCoordinatorDto,
} from '../../dto';
import { ServiceCoordinatorEntity } from '../../database';
import { Equal, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AgencyService } from '../agency/agency.service';

@Injectable()
export class ServiceCoordinatorService {
  constructor(
    @InjectRepository(ServiceCoordinatorEntity)
    private serCoRepository: Repository<ServiceCoordinatorEntity>,
    private readonly agencyService: AgencyService,
  ) {}

  async isSerCoordinatorExist(
    agencyId,
    emailId,
  ): Promise<ServiceCoordinatorEntity> {
    return await this.serCoRepository
      .createQueryBuilder('serviceCoordinator')
      .leftJoin('serviceCoordinator.agency', 'agency')
      .where(
        'serviceCoordinator.isActive = :ISACTIVE AND serviceCoordinator.isDelete = :ISDELETE AND ' +
          'serviceCoordinator.emailId = :EMAIL',
        {
          ISACTIVE: true,
          ISDELETE: false,
          EMAIL: emailId.toLocaleLowerCase(),
          //AGENCYID: agencyId, AND agency.agencyId = :AGENCYID
        },
      )
      .getOne();
  }

  async save(data: CreateServiceCoordinatorDto) {
    const agency = await this.agencyService.findOneAgency(data.agencyId);
    return await this.serCoRepository.save({
      name: data.name,
      phoneNo: data.phoneNo,
      emailId: data.emailId.toLocaleLowerCase(),
      agency: agency,
    });
  }

  async findAll(): Promise<ServiceCoordinatorEntity[]> {
    return await this.serCoRepository
      .createQueryBuilder('serviceCoordinator')
      .leftJoinAndSelect('serviceCoordinator.agency', 'agency')
      .where(
        'serviceCoordinator.isActive = :isActive AND serviceCoordinator.isDelete = :isDelete',
        {
          isActive: true,
          isDelete: false,
        },
      )
      .orderBy({
        'serviceCoordinator.createdAt': 'ASC',
      })
      .getMany();
  }

  async findAllByAgencyId(id): Promise<ServiceCoordinatorEntity[]> {
    return await this.serCoRepository
      .createQueryBuilder('serviceCoordinator')
      .leftJoin('serviceCoordinator.agency', 'agency')
      .where(
        'serviceCoordinator.isActive = :isActive AND serviceCoordinator.isDelete = :isDelete AND agency.agencyId = :agencyId',
        {
          isActive: true,
          isDelete: false,
          agencyId: id,
        },
      )
      .orderBy({
        'LOWER(serviceCoordinator.name)': 'ASC',
      })
      .getMany();
  }

  public async isServiceCoExistInOtherId(
    id,
    serviceCoordinator,
  ): Promise<ServiceCoordinatorEntity> {
    return await this.serCoRepository.findOne({
      relations: ['agency'],
      where: {
        isActive: true,
        isDelete: false,
        emailId: serviceCoordinator.emailId.toLocaleLowerCase(),
        serviceCoordinatorId: Not(id),
        //agency: { agencyId: Equal(serviceCoordinator.agencyId) },
      },
    });
  }

  public async isServiceCoExistById(id): Promise<ServiceCoordinatorEntity> {
    return await this.serCoRepository.findOne({
      isActive: true,
      isDelete: false,
      serviceCoordinatorId: Equal(id),
    });
  }
  async update(id: string, data: UpdateServiceCoordinatorDto) {
    const agency = await this.agencyService.findOneAgency(data.agencyId);
    return await this.serCoRepository.update(id, {
      name: data.name,
      phoneNo: data.phoneNo,
      emailId: data.emailId,
      agency: agency,
    });
  }

  async archiveServiceCoordinator(id: string) {
    const data: any = await this.isAssignedToAnyIntake(id);
    if (data.intakes.length) {
      throw new ConflictException(
        'System Restricted. Service Coordinator already assigned to children.',
      );
    } else {
      return await this.serCoRepository.update(id, {
        isActive: false,
        isDelete: true,
      });
    }
  }

  async isAssignedToAnyIntake(id: string) {
    return await this.serCoRepository.findOne({
      join: {
        alias: 'serviceCoordinator',
        leftJoinAndSelect: {
          intakes: 'serviceCoordinator.intakes',
        },
      },
      where: {
        isActive: true,
        isDelete: false,
        serviceCoordinatorId: id,
      },
    });
  }
}
