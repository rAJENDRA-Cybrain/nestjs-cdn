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
import { ConversationTypeEntity, UserEntity } from '../../database';
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

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.conversationsRecordedBy,
  )
  @JoinColumn([{ name: 'addedBy', referencedColumnName: 'userId' }])
  conversationAddedBy: UserEntity;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
