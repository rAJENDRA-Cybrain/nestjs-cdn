import { IsNotEmpty, Length, IsBoolean } from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ServiceCoordinatorEntity } from './service-coordinator.entity';

@Entity('tbl_CRMAgency')
export class AgencyEntity {
  @PrimaryGeneratedColumn('uuid')
  agencyId: string;

  @Column()
  @Length(0, 250)
  @IsNotEmpty()
  agencyName: string;

  @Column()
  @Length(0, 550)
  @IsNotEmpty()
  description: string;

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
    () => ServiceCoordinatorEntity,
    (ServiceCoordinatorEntity) => ServiceCoordinatorEntity.agency,
  )
  includeServiceCoordinator: ServiceCoordinatorEntity[];
}
