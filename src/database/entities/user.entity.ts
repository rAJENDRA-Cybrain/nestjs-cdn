import { IsNotEmpty, Length, IsEmail, IsString } from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import {
  RoleEntity,
  IntakeEntity,
  ManageChildNotesEntity,
  RecordConversationEntity,
  ReportsGeneratedEntity,
} from 'src/database';
@Entity('tbl_CRMUser')
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

  @ManyToOne(() => RoleEntity, (roleEntity) => roleEntity.roles)
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

  @OneToMany(
    () => ManageChildNotesEntity,
    (manageChildNotesEntity) => manageChildNotesEntity.notesAddedBy,
  )
  notesAddedBy: ManageChildNotesEntity[];

  @OneToMany(
    () => RecordConversationEntity,
    (recordConversationEntity) => recordConversationEntity.conversationAddedBy,
  )
  conversationsRecordedBy: RecordConversationEntity[];

  @OneToMany(() => ReportsGeneratedEntity, (entity) => entity.reportGeneratedBy)
  reportGeneratedBy: ReportsGeneratedEntity[];
}
