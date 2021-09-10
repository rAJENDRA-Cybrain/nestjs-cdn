import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManageChildNotesEntity, IntakeEntity } from '../../database';
import {
  CreateManageChildNotesDto,
  UpdateManageChildNotesDto,
} from '../../dto';

@Injectable()
export class ManageChildService {
  constructor(
    @InjectRepository(ManageChildNotesEntity)
    private notesRepository: Repository<ManageChildNotesEntity>,
    @InjectRepository(IntakeEntity)
    private intakeRepository: Repository<IntakeEntity>,
  ) {}

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
