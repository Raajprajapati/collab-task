import { Response } from 'express';
import { TaskService } from '../services/taskService';
import { AuthRequest } from '../middleware/authMiddleware';

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const tasks = await this.taskService.getTasks(userId);
            res.json(tasks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        }
    };

    createTask = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const task = await this.taskService.createTask(userId, req.body);
            res.status(201).json(task);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to create task' });
        }
    };

    updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const task = await this.taskService.updateTask(id, req.body);
            res.json(task);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update task' });
        }
    };

    deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.taskService.deleteTask(id);
            res.json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete task' });
        }
    };
}
