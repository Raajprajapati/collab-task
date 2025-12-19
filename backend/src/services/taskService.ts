import { TaskRepository } from '../repositories/taskRepository';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import type { Task } from '../../generated/prisma/client';
import { Priority, Status } from '../../generated/prisma';
import { FilterTasks } from '../types';
import { NotificationService } from './notificationService';
import createNotification from '../utils/notifications';
import { UserRepository } from '../repositories/userRepository';
import { emitNotification } from './socketService';

export class TaskService {
    private taskRepository: TaskRepository;
    private notificationService: NotificationService;
    private userRepository: UserRepository;

    constructor() {
        this.taskRepository = new TaskRepository();
        this.notificationService = new NotificationService();
        this.userRepository = new UserRepository();
    }

    async getTasks(userId: string, filter?: FilterTasks): Promise<Task[]> {
        return await this.taskRepository.findAllByUserId(userId, filter);
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

        const user = await this.userRepository.findById(userId);

        const notification = createNotification(user!, {
            assignedToId: data.assignedToId
        });

        if (notification) {
            await this.notificationService.createNotification(notification);
            emitNotification(notification.userId, notification);

        }

        return await this.taskRepository.create(taskData);
    }

    async updateTask(id: string, userId: string, data: UpdateTaskDto): Promise<Task> {
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

        const oldTask = await this.taskRepository.findById(id);

        const updatedTask = await this.taskRepository.update(id, taskData);
        const user = await this.userRepository.findById(userId);


        const notification = createNotification(user!, taskData, oldTask);

        if (notification) {
            await this.notificationService.createNotification(notification);
            emitNotification(notification.userId, notification);
        }

        return updatedTask;
    }

    async deleteTask(id: string): Promise<void> {
        await this.taskRepository.delete(id);
    }

    async getAssignedTasks(userId: string): Promise<Task[]> {
        return await this.taskRepository.findByAssignedToId(userId);
    }
}
