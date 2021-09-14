import {
  IsNotEmpty,
  Length,
  IsEmail,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IntakeEntity } from 'src/database';

@Entity('tbl_CRMIntakeAdditionalChildren')
export class AdditionalChildrenEntity {
  @PrimaryGeneratedColumn('uuid')
  additionalChildrenId: string;

  @Column()
  @IsString()
  @Length(5, 200)
  @IsNotEmpty()
  childName: string;

  @Column()
  @IsNumber()
  @Length(0, 20)
  @IsNotEmpty()
  childAge: number;

  @ManyToOne(() => IntakeEntity, (intakeEntity) => intakeEntity.additionalChild)
  @JoinColumn({ name: 'intakeId' })
  intake: IntakeEntity;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ default: false })
  @IsBoolean()
  isDelete: boolean;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;
}
