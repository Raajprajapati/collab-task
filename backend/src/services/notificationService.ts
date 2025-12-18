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

    getNotificationById = async (id: string): Promise<Notification | null> => {
        return await this.notificationRepository.getNotificationById(id);
    }

    markRead = async (id: string): Promise<void> => {
        await this.notificationRepository.markRead(id);
    }

    deleteNotification = async (id: string): Promise<void> => {
        await this.notificationRepository.deleteNotification(id);
    }

}