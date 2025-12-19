import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { authenticate } from '../middleware/authMiddleware';
import { validationDto } from '../middleware/validationMiddleware';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';

const router = Router();
const taskController = new TaskController();

// Protected tasks routes
router.use(authenticate);

router.get('/', taskController.getTasks);
router.post('/', validationDto(CreateTaskDto), taskController.createTask);
router.put('/:id', validationDto(UpdateTaskDto), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
