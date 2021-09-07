import { IsBoolean, IsNotEmpty, Length } from 'class-validator';
import {
  Entity,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tbl_Role')
@Unique('role_unique_constraint', ['role'])
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  roleId: string;

  @Column()
  @Length(5, 50)
  @IsNotEmpty()
  role: string;

  @Column()
  @Length(0, 100)
  description: string;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
