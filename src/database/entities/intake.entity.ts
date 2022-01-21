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
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  ManageChildNotesEntity,
  ServiceCoordinatorEntity,
  AdditionalChildrenEntity,
  UserEntity,
  EmailLogsEntity,
} from 'src/database';
@Entity('tbl_CRMIntake')
export class IntakeEntity {
  @PrimaryGeneratedColumn('uuid')
  intakeId: string;

  @Column()
  @IsString()
  @Length(5, 200)
  @IsNotEmpty()
  childName: string;

  @Column({ nullable: true })
  @IsString()
  @Length(5, 200)
  childMiddleName: string;

  @Column({ nullable: true })
  @IsString()
  @Length(5, 200)
  childLastName: string;

  @Column({ nullable: false })
  @IsString()
  @Length(1, 200)
  gender: string;

  @Column({ type: 'date' })
  @IsNotEmpty()
  dateOfBirth: Date;

  @Column({ type: 'date' })
  @IsNotEmpty()
  dateOfReceived: Date;

  @Column({ nullable: true, default: '' })
  @Length(0, 200)
  preSchool: string;

  @Column({ nullable: true, default: '' })
  @Length(0, 200)
  dayCare: string;

  @Column({ nullable: true, default: '' })
  @Length(0, 200)
  otherServices: string;

  @Column()
  @IsString()
  @Length(0, 50)
  @IsNotEmpty()
  ethnicity: string;

  @Column({ nullable: true })
  @IsString()
  @Length(0, 200)
  otherEthnicity: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  fluentInEng: string;

  @Column()
  @IsString()
  @Length(0, 200)
  otherLang: string;

  @Column({ nullable: true })
  @IsString()
  @Length(0, 200)
  otherLanguage: string;

  @Column()
  @IsString()
  @Length(0, 500)
  @IsNotEmpty()
  childDiagnosis: string;

  @Column()
  @IsString()
  @Length(0, 200)
  @IsNotEmpty()
  parentName: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 200)
  @IsNotEmpty()
  parentLastName: string;

  @Column()
  @IsString()
  @Length(0, 100)
  @IsNotEmpty()
  relationshipToChild: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 100)
  parentEmail: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 100)
  parentSecondaryEmail: string;

  @Column()
  @IsString()
  @Length(0, 500)
  @IsNotEmpty()
  address: string;

  @Column({ nullable: true })
  @IsString()
  @Length(0, 100)
  state: string;

  @Column()
  @IsString()
  @Length(0, 100)
  @IsNotEmpty()
  city: string;

  @Column()
  @IsString()
  @Length(0, 10)
  @IsNotEmpty()
  zipcode: string;

  @Column({ nullable: true, default: '' })
  secondaryMailAddress: string;

  @Column({ nullable: true, default: '' })
  secondaryMailState: string;

  @Column({ nullable: true, default: '' })
  secondaryMailCity: string;

  @Column({ nullable: true, default: '' })
  secondaryMailZipcode: string;

  @Column()
  @IsString()
  @Length(0, 14)
  homePhnNo: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 14)
  cellPhnNo: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 14)
  workPhnNo: string;

  @Column()
  @IsString()
  @Length(0, 14)
  @IsNotEmpty()
  isReferal: string;

  @ManyToOne(() => ServiceCoordinatorEntity, (service) => service.intakes)
  @JoinColumn({ name: 'serviceCoordinatorId' })
  serviceCoordinator: ServiceCoordinatorEntity;

  @Column('text', { array: true, nullable: true })
  @IsString({ each: true })
  public reasonForReferal: string[];

  @Column({ nullable: true })
  @IsString()
  @Length(0, 200)
  earlyStartServices: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 1000)
  otherRelevantInformation: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.efcEmployee)
  @JoinColumn({ name: 'userId' })
  efcEmployee: UserEntity;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 1000)
  tpEarlyStartFamillySpecialist: string;

  @Column({ type: 'date', nullable: true })
  tpEarlyStartFamillySpecialistDate: Date;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  tpQuestionToParentOneAns: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  tpQuestionToParentTwoAns: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  tpQuestionToParentThirdAns: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  tpQuestionToParentThirdAAns: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  tpQuestionToParentFourthAns: string;

  @Column({ nullable: true, type: 'date' })
  tpCompletedDate: Date;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  isEligibleForKERN: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  epQuestionToParentOneAns: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  epQuestionToParentTwoAns: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  epQuestionToParentThirdAns: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  epQuestionToParentThirdAAns: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  epQuestionToParentFourthAns: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  epContinueStatus: string;

  @Column({ nullable: true, default: '' })
  @IsString()
  @Length(0, 20)
  epExitReason: string;

  @Column({ nullable: true, type: 'date' })
  epCompletedDate: Date;

  @Column({ nullable: true, type: 'date' })
  dateOfIntake: Date;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @Column({ default: false })
  @IsBoolean()
  isDelete: boolean;

  @Column({ default: '' })
  addedBy: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(
    () => AdditionalChildrenEntity,
    (additionalChildrenEntity) => additionalChildrenEntity.intake,
  )
  additionalChild: AdditionalChildrenEntity[];

  @OneToMany(
    () => ManageChildNotesEntity,
    (manageChildNotesEntity) => manageChildNotesEntity.intakeChild,
  )
  childNotes: ManageChildNotesEntity[];

  @OneToMany(() => EmailLogsEntity, (EmailLogs) => EmailLogs.intake)
  emailLogs: EmailLogsEntity[];
}
