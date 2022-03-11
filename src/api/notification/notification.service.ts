import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from '../../database';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
  ) {}

  public async notify(
    userId: string,
    title: string,
    description: string,
    slug_id: string,
    slug: string,
    redirect: string = null,
  ) {
    return this.notificationRepository.save({
      userId: userId,
      title: title,
      description: description,
      slug_id: slug_id,
      slug: slug,
      redirect: redirect,
    });
  }

  public async findAllNotification(
    userId: string,
    isSeen: boolean,
    isRead: boolean,
  ) {
    return await this.notificationRepository
      .createQueryBuilder('Notification')
      .where(
        `Notification.userId = :userId AND Notification.isRead = :isRead AND Notification.isSeen = :isSeen`,
        { userId: userId, isRead: isRead, isSeen: isSeen },
      )
      .orderBy({ 'Notification.createdAt': 'DESC' })
      .getMany();
  }
}
