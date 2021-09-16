import { IsNotEmpty, Length, IsString, IsBoolean } from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EmailTemplateEntity } from '../../database';
@Entity('tbl_CRMEmailTemplateAttachments')
export class EmailTemplateAttachmentsEntity {
  @PrimaryGeneratedColumn('uuid')
  attachmentId: string;

  @ManyToOne(
    () => EmailTemplateEntity,
    (emailTemplateEntity) => emailTemplateEntity.attachments,
  )
  @JoinColumn({ name: 'templateId' })
  templates: EmailTemplateEntity;

  @Column()
  @IsString()
  @Length(0, 100)
  @IsNotEmpty()
  attachmentFileName: string;

  @Column()
  @IsString()
  @Length(4, 50)
  @IsNotEmpty()
  attachmentFileUri: string;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ default: false })
  @IsBoolean()
  isDelete: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @CreateDateColumn()
  public createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn()
  public updatedAt: Date;
}
