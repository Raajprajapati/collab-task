import { Response } from 'express';
import { TaskService } from '../services/taskService';
import { AuthRequest } from '../middleware/authMiddleware';
import { emitTaskUpdate } from '../services/socketService';
import { FilterTasks } from '../types';

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

            const { order, orderBy, search, filters } = req.query as FilterTasks;

            const filterParams = {
                order: order,
                orderBy: orderBy,
                search: search,
                filters: filters
            };

            const tasks = await this.taskService.getTasks(userId, filterParams);
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
            const userId = req.user?.id;

            const task = await this.taskService.updateTask(id, userId!, req.body);
            emitTaskUpdate(task);
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
            emitTaskUpdate(id);
            res.json({ message: 'Task deleted successfully' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to delete task' });
        }
    };
}
