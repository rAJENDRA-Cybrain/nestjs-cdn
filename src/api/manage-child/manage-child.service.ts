import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { ManageChildNotesEntity, IntakeEntity } from '../../database';
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
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async findChild(userId: string) {
    const user = await this.authService.findRoleByUserId(userId);
    if (user.role.role == 'Super Admin') {
      return await this.intakeRepository.find({
        relations: ['serviceCoordinator', 'efcEmployee'],
        where: { isActive: true },
      });
    } else if (user.role.role == 'Efc Employee') {
      return await this.intakeRepository.find({
        relations: ['serviceCoordinator', 'efcEmployee'],
        where: { isActive: true, efcEmployee: Equal(userId) },
      });
    } else if (user.role.role == 'Operator') {
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
      timestamp: createNotesDto.timestamp,
      notes: createNotesDto.notes,
      intakeChild: childData,
      notesAddedBy: userData,
    });
  }

  public async findAll(intakeId: string): Promise<any> {
    return await this.intakeRepository.find({
      relations: [
        'childNotes',
        'childNotes.conversationType',
        'childNotes.notesAddedBy',
      ],
      where: { intakeId: intakeId },
    });
  }
}
