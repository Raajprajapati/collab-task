import { Notification } from "../../generated/prisma";
import { NotificationRepository } from "../repositories/notificationRepository";

export class NotificationService {
    private notificationRepository: NotificationRepository;

    constructor() {
        this.notificationRepository = new NotificationRepository();
    }

    getNotifications = async (userId: string): Promise<Notification[]> => {
        return await this.notificationRepository.getNotifications(userId);
    }

    getOldNotifications = async (userId: string): Promise<Notification[]> => {
        return await this.notificationRepository.getOldNotifications(userId);
    }

    markRead = async (userId: string): Promise<void> => {
        await this.notificationRepository.markRead(userId);
    }

    deleteNotification = async (id: string): Promise<void> => {
        await this.notificationRepository.deleteNotification(id);
    }

    createNotification = async (notification: Omit<Notification, 'id'>): Promise<Notification> => {
        return await this.notificationRepository.createNotification(notification);
    }

}