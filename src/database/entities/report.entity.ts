import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
@Entity('tbl_CRMReportGenerated')
export class ReportsGeneratedEntity {
  @PrimaryGeneratedColumn('uuid')
  reportsId: string;

  @Column({ type: 'date' })
  @IsString()
  @IsNotEmpty()
  fromDate: Date;

  @Column({ type: 'date' })
  @IsString()
  @IsNotEmpty()
  toDate: Date;

  @Column()
  @IsString()
  @IsNotEmpty()
  fileLink: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.reportGeneratedBy)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
  reportGeneratedBy: UserEntity;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
