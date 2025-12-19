import { useEffect, useState } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import TaskModal from '../components/TaskModal';
import api from '../services/api';
import type { Task } from '../types';
import { API_URLS } from '../utils/apiUrls';
import TaskCard from '../components/TaskCard';
import { useSocket } from '../context/SocketContext';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { socket } = useSocket();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const response = await api.get(API_URLS.tasks);
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTask = () => {
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(API_URLS.deleteTask(id));
                fetchTasks();
            } catch (error) {
                console.error('Failed to delete task', error);
            }
        }
    };

    const handleTaskSaved = () => {
        fetchTasks();
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('taskUpdated', (updatedTask: Task) => {
            setTasks((prevTasks) => {
                const taskExists = prevTasks.find(t => t.id === updatedTask.id);
                if (taskExists) {
                    return prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
                } else {
                    return [...prevTasks, updatedTask];
                }
            });
        });

        socket.on('taskDeleted', (deletedTaskId: string) => {
            setTasks((prevTasks) => prevTasks.filter(t => t.id !== deletedTaskId));
        });

        if (user?.id) {
            socket.on(`notification_${user.id}`, (notification: any) => {
                console.log('New notification:', notification);
                alert(`New notification: ${notification.message || JSON.stringify(notification)}`);
            });
        }

        return () => {
            socket.off('taskUpdated');
            socket.off('taskDeleted');
            if (user?.id) {
                socket.off(`notification_${user.id}`);
            }
        };
    }, [socket, user]);
    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">CollabTask</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
                            <Button variant="ghost" onClick={logout} className="text-sm">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
                    <Button onClick={handleCreateTask}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
                        <p className="mt-2 text-gray-500">Get started by creating a new task.</p>
                        <div className="mt-6">
                            <Button onClick={handleCreateTask}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Task
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} handleDeleteTask={handleDeleteTask} handleEditTask={handleEditTask} />
                        ))}
                    </div>
                )}
            </main>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTaskSaved={handleTaskSaved}
                task={selectedTask}
            />
        </div>
    );
};

export default Dashboard;
