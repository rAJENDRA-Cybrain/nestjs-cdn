import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AgencyEntity, IntakeEntity } from 'src/database';
import { CreateAgencyDto, UpdateAgencyDto } from 'src/dto';
import { Not, Repository } from 'typeorm';
@Injectable()
export class AgencyService {
  constructor(
    @InjectRepository(AgencyEntity)
    private agencyRepository: Repository<AgencyEntity>,
    @InjectRepository(IntakeEntity)
    private intakeRepository: Repository<IntakeEntity>,
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
    if (data.length) {
      throw new ConflictException(
        'System Restricted. Agency alraedy assigned to children.',
      );
    } else {
      return await this.agencyRepository.update(id, {
        isActive: false,
        isDelete: true,
      });
    }
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
