import { IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { IntakeEntity } from '../../database';

@Entity('tbl_CRMEmailLogs')
export class EmailLogsEntity {
  @PrimaryGeneratedColumn('uuid')
  emailLogId: string;

  @ManyToOne(() => IntakeEntity, (IntakeEntity) => IntakeEntity.emailLogs)
  @JoinColumn({ name: 'intakeId' })
  intake: IntakeEntity;

  @Column()
  @IsString()
  @IsNotEmpty()
  emailLogSmtpId: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  emailLogSmtpUserName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  emailLogSmtpDisplayName: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  emailLogTo: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  emailLogSubject: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  emailLogBody: string;

  @Column('text', { array: true, nullable: true })
  @IsString({ each: true })
  emailLogAttachments: string[];

  @Column()
  @CreateDateColumn()
  public createdAt: Date;
}
