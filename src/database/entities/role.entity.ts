import { IsBoolean, IsNotEmpty, Length } from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
@Entity('tbl_Role')
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

  @OneToMany(() => UserEntity, (userEntity) => userEntity.role)
  roles: UserEntity[];
}
