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
} from 'typeorm';
@Entity('tbl_CRMSmtpDetails')
export class SmtpDetailEntity {
  @PrimaryGeneratedColumn('uuid')
  smtpId: string;

  @Column()
  @Length(4, 50)
  @IsNotEmpty()
  smtpUserName: string;

  @Column()
  @Length(4, 50)
  @IsNotEmpty()
  smtpPassword: string;

  @Column()
  @Length(10, 100)
  @IsNumber()
  @IsNotEmpty()
  smtpPort: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  smtpHost: string;

  @Column()
  @IsNotEmpty()
  smtpDisplayName: string;

  @Column()
  @IsBoolean()
  @Length(2, 50)
  @IsNotEmpty()
  smtpSsl: boolean;

  @Column({ default: false })
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
