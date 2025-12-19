import { TaskRepository } from '../repositories/taskRepository';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import type { Task } from '../../generated/prisma/client';
import { Priority, Status } from '../../generated/prisma';

export class TaskService {
    private taskRepository: TaskRepository;

    constructor() {
        this.taskRepository = new TaskRepository();
    }

    async getTasks(userId: string, params?: { filter: 'createdBy' | 'assignedTo' | 'overdue' | undefined }): Promise<Task[]> {
        switch (params?.filter) {
            case 'createdBy':
                return await this.taskRepository.findByCreatorId(userId);
            case 'assignedTo':
                return await this.taskRepository.findByAssignedToId(userId);
            case 'overdue':
                return await this.taskRepository.findOverdueTasks(userId);
            default:
                return await this.taskRepository.findAllByUserId(userId);
        }
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

    async getAssignedTasks(userId: string): Promise<Task[]> {
        return await this.taskRepository.findByAssignedToId(userId);
    }
}
