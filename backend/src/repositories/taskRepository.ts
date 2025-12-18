import prisma from '../db';
import type { Task, Prisma } from '../../generated/prisma/client';

export class TaskRepository {
    async create(data: Prisma.TaskCreateInput): Promise<Task> {
        return await prisma.task.create({
            data,
        });
    }

    async findByUserId(userId: string): Promise<Task[]> {
        return await prisma.task.findMany({
            where: {
                OR: [
                    { creatorId: userId },
                    { assignedToId: userId }
                ]
            },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id: string): Promise<Task | null> {
        return await prisma.task.findUnique({
            where: { id },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            },
        });
    }

    async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
        return await prisma.task.update({
            where: { id },
            data,
            include: {
                creator: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.task.delete({
            where: { id },
        });
    }
}
