export class EmailTemplate {}
import {
  IsNotEmpty,
  Length,
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { EmailTemplateAttachmentsEntity } from '../../database';
@Entity('tbl_CRMEmailTemplate')
export class EmailTemplateEntity {
  @PrimaryGeneratedColumn('uuid')
  templateId: string;

  @Column()
  @IsString()
  @Length(0, 100)
  @IsNotEmpty()
  templateTitle: string;

  @Column()
  @IsString()
  @Length(4, 100)
  @IsNotEmpty()
  templateSubject: string;

  @Column()
  @IsString()
  @Length(10, 5000)
  @IsNotEmpty()
  templateBody: string;

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

  @OneToMany(
    () => EmailTemplateAttachmentsEntity,
    (emailTemplateAttachmentsEntity) =>
      emailTemplateAttachmentsEntity.templates,
  )
  attachments: EmailTemplateAttachmentsEntity[];
}
