import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { NotificationController } from '../controllers/notificationController';

const router = Router();

const notificationController = new NotificationController();

router.use(authenticate);

router.get('/', notificationController.getNotifications);
router.put('/:id/read', notificationController.markRead);

export default router;
