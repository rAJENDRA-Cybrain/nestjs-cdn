import { IsNotEmpty, Length, IsBoolean } from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
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
