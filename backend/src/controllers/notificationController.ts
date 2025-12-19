import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { NotificationService } from '../services/notificationService';


export class NotificationController {
    private notificationService: NotificationService;
    constructor() {
        this.notificationService = new NotificationService();
    }

    getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;

            const notifications = await this.notificationService.getNotifications(userId!);
            res.json(notifications);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    }

    markRead = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            await this.notificationService.markRead(userId!);
            res.json({ message: 'Notification marked as read' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to mark notification as read' });
        }
    }

    getOldNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;

            const notifications = await this.notificationService.getOldNotifications(userId!);
            res.json(notifications);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch old notifications' });
        }
    }
}
