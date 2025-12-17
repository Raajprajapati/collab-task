import { Router } from 'express';
import { register, login, logout, getDetails } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';

import { validationDto } from '../middleware/validationMiddleware';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

const router = Router();

router.post('/register', validationDto(RegisterDto), register);
router.post('/login', validationDto(LoginDto), login);
router.post('/logout', logout);
router.get('/details', authenticate, getDetails);

export default router;
