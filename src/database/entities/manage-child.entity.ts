import { IsBoolean, IsNotEmpty, Length } from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  ConversationTypeEntity,
  UserEntity,
  IntakeEntity,
} from '../../database';
@Entity('tbl_CRMNotes')
export class ManageChildNotesEntity {
  @PrimaryGeneratedColumn('uuid')
  notesId: string;

  @ManyToOne(
    () => ConversationTypeEntity,
    (conversationTypeEntity) => conversationTypeEntity.conversations,
  )
  @JoinColumn({ name: 'conversationTypeId' })
  conversationType: ConversationTypeEntity;

  @Column({ type: 'date' })
  @IsNotEmpty()
  date: Date;

  @Column()
  @IsNotEmpty()
  timestamp: string;

  @Column()
  @Length(0, 1500)
  @IsNotEmpty()
  notes: string;

  @ManyToOne(() => IntakeEntity, (intakeEntity) => intakeEntity.childNotes)
  @JoinColumn({ name: 'intakeId' })
  intakeChild: IntakeEntity;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.notesAddedBy)
  @JoinColumn({ name: 'addedBy' })
  notesAddedBy: UserEntity;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
