import { IsBoolean, IsNotEmpty, Length } from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ConversationTypeEntity } from '../../database';

@Entity('tbl_CRMRecordConversation')
export class RecordConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  conversationId: string;

  @ManyToOne(
    () => ConversationTypeEntity,
    (conversationTypeEntity) => conversationTypeEntity.recordConversations,
  )
  @JoinColumn({ name: 'conversationTypeId' })
  conversationType: ConversationTypeEntity;

  @Column({ type: 'date' })
  @IsNotEmpty()
  conversationDate: Date;

  @Column()
  @IsNotEmpty()
  conversationTimestamp: string;

  @Column()
  @Length(0, 1500)
  @IsNotEmpty()
  conversationDescriptions: string;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
