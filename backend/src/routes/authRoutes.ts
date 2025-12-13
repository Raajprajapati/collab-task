import { Router } from 'express';
import { register, login, logout, getDetails } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/details', authenticate, getDetails);

export default router;
