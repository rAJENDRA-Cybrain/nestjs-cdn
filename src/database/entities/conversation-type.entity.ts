import { IsBoolean, IsNotEmpty, Length } from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import {
  ManageChildNotesEntity,
  RecordConversationEntity,
} from '../../database';

@Entity('tbl_CRMConversationType')
export class ConversationTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  conversationTypeId: string;

  @Column()
  @Length(0, 100)
  @IsNotEmpty()
  type: string;

  @Column()
  @Length(0, 100)
  description: string;

  @Column({ default: true })
  @IsBoolean()
  options: boolean;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(
    () => ManageChildNotesEntity,
    (manageChildNotesEntity) => manageChildNotesEntity.conversationType,
  )
  conversations: ManageChildNotesEntity[];

  @OneToMany(
    () => RecordConversationEntity,
    (recordConversationEntity) => recordConversationEntity.conversationType,
  )
  recordConversations: RecordConversationEntity[];
}
