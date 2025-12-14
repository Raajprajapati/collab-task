import type { Request, Response } from 'express';
import { UserService } from '../services/userService.js';
import type { AuthRequest } from '../middleware/authMiddleware.js';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password, name } = req.body;
            if (!email || !password || !name) {
                res.status(400).json({ error: 'Email, password, and name are required' });
                return;
            }

            const user = await this.userService.registerUser({ email, password, name });
            res.status(201).json({ message: 'User registered successfully', userId: user.id });
        } catch (error: any) {
            if (error.message === 'User already exists') {
                res.status(400).json({ error: 'User already exists' });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const user = await this.userService.getUserProfile(req.user.id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const { name, password } = req.body;
            const updatedUser = await this.userService.updateUserProfile(req.user.id, { name, password });

            const { password: _, ...userWithoutPassword } = updatedUser;
            res.json({ message: 'Profile updated successfully', user: userWithoutPassword });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
