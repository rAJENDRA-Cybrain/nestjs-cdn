import { IsNotEmpty, Length, IsEmail, IsString } from 'class-validator';
import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { RoleEntity, IntakeEntity } from 'src/database';
@Entity('tbl_CRMUser')
@Unique('user_unique_constraint', [
  'emailId',
  'contactNo',
  'userName',
  'password',
])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  @Length(4, 50)
  @IsNotEmpty()
  firstName: string;

  @Column()
  @Length(4, 50)
  @IsNotEmpty()
  lastName: string;

  @Column()
  @Length(10, 100)
  @IsEmail()
  @IsNotEmpty()
  emailId: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  contactNo: string;

  @Column()
  @IsNotEmpty()
  dateOfJoining: Date;

  @Column()
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  userName: string;

  @Column()
  @Length(8, 50)
  @IsNotEmpty()
  password: string;

  @OneToOne(() => RoleEntity)
  @JoinColumn({ name: 'roleId' })
  role: RoleEntity;

  @Column({ default: 'Active' })
  status: string; // Active Blocked Deleted

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @CreateDateColumn()
  public createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => IntakeEntity, (intakeEntity) => intakeEntity.efcEmployee)
  efcEmployee: IntakeEntity[];
}
