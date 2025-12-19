import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { NotificationController } from '../controllers/notificationController';

const router = Router();

const notificationController = new NotificationController();

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.get('/old', notificationController.getOldNotifications);
router.put('/read', notificationController.markRead);

export default router;
