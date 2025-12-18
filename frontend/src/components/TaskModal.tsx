import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Priority, Status } from '../types';
import type { Task } from '../types';
import api from '../services/api';
import { API_URLS } from '../utils/apiUrls';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().min(1, 'Description is required'),
    dueDate: z.string().optional(),
    priority: z.enum(Priority),
    status: z.enum(Status),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskSaved: () => void;
    task?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onTaskSaved, task }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            priority: Priority.LOW,
            status: Status.TODO,
        },
    });

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                description: task.description,
                dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                priority: task.priority,
                status: task.status,
            });
        } else {
            reset({
                title: '',
                description: '',
                dueDate: '',
                priority: Priority.LOW,
                status: Status.TODO,
            });
        }
    }, [task, reset, isOpen]);

    const onSubmit = async (data: TaskFormData) => {
        try {
            if (task) {
                await api.put(API_URLS.updateTask(task.id), data);
            } else {
                await api.post(API_URLS.createTask, data);
            }
            onTaskSaved();
            onClose();
        } catch (error) {
            console.error('Failed to save task', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 opacity-100 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        {task ? 'Edit Task' : 'Create Task'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Title *"
                        error={errors.title?.message}
                        {...register('title')}
                    />

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Description *
                        </label>
                        <textarea
                            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                            rows={3}
                            {...register('description')}
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                        )}
                    </div>

                    <Input
                        label="Due Date"
                        type="date"
                        error={errors.dueDate?.message}
                        {...register('dueDate')}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Priority
                            </label>
                            <select
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                {...register('priority')}
                            >
                                {Object.values(Priority).map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Status
                            </label>
                            <select
                                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                                {...register('status')}
                            >
                                {Object.values(Status).map((s) => (
                                    <option key={s} value={s}>
                                        {s.replace('_', ' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isSubmitting}>
                            {task ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
