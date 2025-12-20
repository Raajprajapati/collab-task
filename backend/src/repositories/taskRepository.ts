import prisma from '../db';
import type { Task, Prisma } from '../../generated/prisma/client';
import { FilterTasks } from '../types';

export class TaskRepository {
    async create(data: Prisma.TaskCreateInput): Promise<Task> {
        return await prisma.task.create({
            data,
        });
    }

    async findAllByUserId(userId: string, filter?: FilterTasks): Promise<Task[]> {
        const andConditions: any[] = [];


        // Dynamic filters
        if (filter?.filterBy && filter?.filterValue) {
            andConditions.push({
                [filter.filterBy]: filter.filterValue
            });
        }

        // Search filter
        if (filter?.search) {
            andConditions.push({
                title: {
                    contains: filter.search,
                    mode: 'insensitive'
                }
            });
        }

        return prisma.task.findMany({
            where: {
                OR: [
                    { creatorId: userId },
                    { assignedToId: userId }
                ],
                ...(andConditions.length > 0 && { AND: andConditions })
            },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            },
            orderBy: {
                [filter?.orderBy ?? 'createdAt']: filter?.order ?? 'desc'
            }
        });
    }
    async findByCreatorId(userId: string): Promise<Task[]> {
        return await prisma.task.findMany({
            where: {
                creatorId: userId
            },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findByAssignedToId(userId: string): Promise<Task[]> {
        return await prisma.task.findMany({
            where: {
                assignedToId: userId
            },
            include: {
                creator: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOverdueTasks(userId: string): Promise<Task[]> {
        return await prisma.task.findMany({
            where: {
                assignedToId: userId,
                dueDate: {
                    lt: new Date()
                }
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
