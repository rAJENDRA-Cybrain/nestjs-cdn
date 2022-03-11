import { IsBoolean, Length } from 'class-validator';
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('tbl_CRMNotification')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true, default: '' })
  title: string;

  @Column({ nullable: true, default: '' })
  @Length(0, 100)
  description: string;

  @Column({ nullable: true, default: null })
  slug_id: string;

  @Column({ nullable: true, default: null })
  slug: string;

  @Column({ nullable: true, default: '' })
  redirect: string;

  @Column({ default: false })
  @IsBoolean()
  isSeen: boolean;

  @Column({ default: false })
  @IsBoolean()
  isRead: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
