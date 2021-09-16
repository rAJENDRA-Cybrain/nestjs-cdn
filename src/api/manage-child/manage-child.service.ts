import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import {
  ManageChildNotesEntity,
  IntakeEntity,
  UserEntity,
} from '../../database';
import {
  CreateManageChildNotesDto,
  UpdateManageChildNotesDto,
} from '../../dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ManageChildService {
  constructor(
    @InjectRepository(ManageChildNotesEntity)
    private notesRepository: Repository<ManageChildNotesEntity>,
    @InjectRepository(IntakeEntity)
    private intakeRepository: Repository<IntakeEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async findChild(userId: string, role: any) {
    if (role.role == 'Super Admin') {
      return await this.intakeRepository.find({
        relations: ['serviceCoordinator', 'efcEmployee'],
        where: { isActive: true },
      });
    }
    if (role.role == 'Efc Employee') {
      return await this.intakeRepository.find({
        relations: ['serviceCoordinator', 'efcEmployee'],
        where: { isActive: true, efcEmployee: Equal(userId) },
      });
    }
    if (role.role == 'Operator') {
      return await this.intakeRepository.find({
        relations: ['serviceCoordinator', 'efcEmployee'],
        where: { isActive: true, addedBy: Equal(userId) },
      });
    }
  }

  public async save(
    createNotesDto: CreateManageChildNotesDto,
    convData,
    childData,
    userData,
  ) {
    return this.notesRepository.save({
      conversationType: convData,
      date: createNotesDto.date,
      timestamp: createNotesDto.timestamp,
      notes: createNotesDto.notes,
      intakeChild: childData,
      notesAddedBy: userData,
    });
  }

  public async findNotes(intakeId: string): Promise<any> {
    return await this.intakeRepository
      .createQueryBuilder('intake')
      .innerJoinAndSelect(
        'intake.childNotes',
        'childNotes',
        'childNotes.isActive = :isActive',
        { isActive: true },
      )
      .innerJoinAndSelect('childNotes.conversationType', 'conversationType')
      .innerJoinAndSelect('childNotes.notesAddedBy', 'notesAddedBy')
      .where('intake.intakeId = :intakeId', { intakeId: intakeId })
      .orderBy({ 'childNotes.createdAt': 'DESC' })
      .getOne();
  }

  public async update(
    notesId: string,
    dto: UpdateManageChildNotesDto,
    convData,
  ) {
    return await this.notesRepository.update(notesId, {
      conversationType: convData,
      timestamp: dto.timestamp,
      notes: dto.notes,
      date: dto.date,
    });
  }
  async updateStatus(id: string) {
    return await this.notesRepository.update(id, {
      isActive: false,
    });
  }

  async findReport() {
    return await this.notesRepository.find({ relations: ['notesAddedBy'] });
  }
}
