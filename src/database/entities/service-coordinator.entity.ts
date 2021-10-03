import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsString,
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
import { IntakeEntity } from './intake.entity';
@Entity('tbl_CRMServiceCordinator')
export class ServiceCoordinatorEntity {
  @PrimaryGeneratedColumn('uuid')
  serviceCoordinatorId: string;

  @Column()
  @IsString()
  @Length(5, 200)
  @IsNotEmpty()
  name: string;

  @Column()
  @IsString()
  @Length(0, 500)
  @IsNotEmpty()
  agency: string;

  @Column()
  @IsString()
  @Length(0, 14)
  phoneNo: string;

  @Column()
  @IsString()
  @Length(0, 100)
  @IsNotEmpty()
  @IsEmail()
  emailId: string;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ default: false })
  @IsBoolean()
  isDelete: boolean;

  @Column({ nullable: true, default: '' })
  addedBy: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(
    () => IntakeEntity,
    (intakeEntity) => intakeEntity.serviceCoordinator,
  )
  intakes: IntakeEntity[];
}
