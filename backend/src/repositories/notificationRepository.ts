import { Notification, Prisma } from "../../generated/prisma";
import prisma from "../db";

export class NotificationRepository {

    constructor() { }

    createNotification = async (data: Omit<Notification, 'id'>): Promise<Notification> => {
        return await prisma.notification.create({
            data
        });
    }

    getNotifications = async (userId: string): Promise<Notification[]> => {
        return await prisma.notification.findMany({
            where: { userId, read: false },
            orderBy: { createdAt: 'desc' }
        });
    }

    getOldNotifications = async (userId: string): Promise<Notification[]> => {
        return await prisma.notification.findMany({
            where: { userId, read: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    getNotificationById = async (id: string): Promise<Notification | null> => {
        return await prisma.notification.findUnique({ where: { id } });
    }

    markRead = async (userId: string): Promise<void> => {
        await prisma.notification.updateMany({
            where: { userId: userId, read: false },
            data: { read: true }
        });
    }

    deleteNotification = async (id: string): Promise<void> => {
        await prisma.notification.delete({
            where: { id },
        });
    }
}