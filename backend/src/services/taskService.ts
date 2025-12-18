import { TaskRepository } from '../repositories/taskRepository';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import type { Task } from '../../generated/prisma/client';
import { Priority, Status } from '../../generated/prisma';

export class TaskService {
    private taskRepository: TaskRepository;

    constructor() {
        this.taskRepository = new TaskRepository();
    }

    async getTasks(userId: string): Promise<Task[]> {
        return await this.taskRepository.findByUserId(userId);
    }

    async createTask(userId: string, data: CreateTaskDto): Promise<Task> {
        const taskData = {
            title: data.title,
            description: data.description || '',
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            priority: data.priority || Priority.LOW,
            status: data.status || Status.TODO,
            creator: { connect: { id: userId } },
            assignedTo: data.assignedToId ? { connect: { id: data.assignedToId } } : undefined,
        };

        return await this.taskRepository.create(taskData);
    }

    async updateTask(id: string, data: UpdateTaskDto): Promise<Task> {
        const taskData: any = {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        };

        // Remove undefined fields
        Object.keys(taskData).forEach(key => taskData[key] === undefined && delete taskData[key]);

        if (data.assignedToId) {
            taskData.assignedTo = { connect: { id: data.assignedToId } };
            delete taskData.assignedToId;
        }

        return await this.taskRepository.update(id, taskData);
    }

    async deleteTask(id: string): Promise<void> {
        await this.taskRepository.delete(id);
    }
}
