import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgencyEntity, IntakeEntity } from 'src/database';
import { CreateAgencyDto, UpdateAgencyDto } from 'src/dto';
//import { ServiceCoordinatorService } from '../service-coordinator/service-coordinator.service';
import { Not, Repository } from 'typeorm';

@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(AgencyEntity)
    private agencyRepository: Repository<AgencyEntity>,
    @InjectRepository(IntakeEntity)
    private intakeRepository: Repository<IntakeEntity>, // private _serviceCoOrdinator: ServiceCoordinatorService,
  ) {}

  public async findAllAgency(): Promise<AgencyEntity[]> {
    return await this.agencyRepository.find({
      where: {
        isActive: true,
      },
      order: { createdAt: 'ASC', agencyId: 'ASC' },
    });
  }

  public async save(createAgencyDto: CreateAgencyDto) {
    return await this.agencyRepository.save(createAgencyDto);
  }

  public async findOneAgency(id: string): Promise<AgencyEntity> {
    return await this.agencyRepository.findOne({
      agencyId: id,
      isActive: true,
      isDelete: false,
    });
  }

  public async update(id: string, updateAgencyDto: UpdateAgencyDto) {
    return await this.agencyRepository.update(id, updateAgencyDto);
  }

  public async isAgencyExist(name): Promise<AgencyEntity> {
    return await this.agencyRepository.findOne({
      agencyName: name,
      isActive: true,
      isDelete: false,
    });
  }

  public async isAgencyExistById(id, agency: string): Promise<AgencyEntity> {
    return await this.agencyRepository.findOne({
      isActive: true,
      isDelete: false,
      agencyName: agency,
      agencyId: Not(id),
    });
  }

  async archiveAgency(id: string) {
    const data = await this.isAssignedToAnyIntake(id);
    const Coodinator: any = await this.isServiceCoOrdinatorAssigned(id);

    if (data.length || Coodinator.includeServiceCoordinator.length) {
      let msg = '';
      if (data.length) {
        msg = 'System Restricted. Agency already assigned to children.';
      } else {
        msg =
          'System Restricted. Agency already assigned to Service Coordinator.';
      }
      throw new ConflictException(msg);
    } else {
      return await this.agencyRepository.update(id, {
        isActive: false,
        isDelete: true,
      });
    }
  }

  async isServiceCoOrdinatorAssigned(id) {
    const query = await this.agencyRepository
      .createQueryBuilder('Agency')
      .select(['Agency', 'service'])
      .leftJoin('Agency.includeServiceCoordinator', 'service')
      .where(
        'Agency.isActive = :IsActive AND Agency.agencyId = :agencyId AND service.isActive = :s_IsActive',
        {
          IsActive: true,
          agencyId: id,
          s_IsActive: true,
        },
      );

    return await query.getOne();
  }

  async isAssignedToAnyIntake(id) {
    return await this.intakeRepository.find({
      join: {
        alias: 'intake',
        leftJoinAndSelect: {
          serviceCoordinator: 'intake.serviceCoordinator',
          agency: 'serviceCoordinator.agency',
        },
      },
      where: {
        isActive: true,
        isDelete: false,
        serviceCoordinator: {
          agency: { agencyId: id },
        },
      },
    });
  }
}
