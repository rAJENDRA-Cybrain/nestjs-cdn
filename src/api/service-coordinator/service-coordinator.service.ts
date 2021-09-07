import { Injectable } from '@nestjs/common';
import {
  CreateServiceCoordinatorDto,
  UpdateServiceCoordinatorDto,
} from '../../dto';
import { ServiceCoordinatorEntity } from '../../database';
import { Equal, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServiceCoordinatorService {
  constructor(
    @InjectRepository(ServiceCoordinatorEntity)
    private serCoRepository: Repository<ServiceCoordinatorEntity>,
  ) {}

  async isSerCoordinatorExist(
    agency,
    emailId,
    name,
    phoneNo,
  ): Promise<ServiceCoordinatorEntity> {
    return await this.serCoRepository.findOne({
      name: name,
      agency: agency,
      emailId: emailId,
      phoneNo: phoneNo,
      isActive: true,
      isDelete: false,
    });
  }

  async save(createServiceCoordinatorDto: CreateServiceCoordinatorDto) {
    return await this.serCoRepository.save(createServiceCoordinatorDto);
  }

  async findAll(): Promise<ServiceCoordinatorEntity[]> {
    return await this.serCoRepository.find({
      where: {
        isActive: true,
        isDelete: false,
      },
      order: { createdAt: 'ASC' },
    });
  }

  public async isServiceCoExistInOtherId(
    id,
    serviceCoordinator,
  ): Promise<ServiceCoordinatorEntity> {
    return await this.serCoRepository.findOne({
      isActive: true,
      isDelete: false,
      emailId: serviceCoordinator.emailId,
      agency: serviceCoordinator.agency,
      serviceCoordinatorId: Not(id),
    });
  }

  public async isServiceCoExistById(id): Promise<ServiceCoordinatorEntity> {
    return await this.serCoRepository.findOne({
      isActive: true,
      isDelete: false,
      serviceCoordinatorId: Equal(id),
    });
  }
  async update(
    serviceCoordinatorId: string,
    updateServiceCoordinatorDto: UpdateServiceCoordinatorDto,
  ) {
    return await this.serCoRepository.update(
      serviceCoordinatorId,
      updateServiceCoordinatorDto,
    );
  }
}
