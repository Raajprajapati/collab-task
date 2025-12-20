import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import TaskModal from '../components/TaskModal';
import api from '../services/api';
import type { Task, FilterTasks, User } from '../types';
import { API_URLS } from '../utils/apiUrls';
import TaskCard from '../components/TaskCard';
import { useSocket } from '../context/SocketContext';
import Header from '../components/Header';
import debounce from '../utils/debounce';
import TaskFilters from '../components/TaskFilters';


const Dashboard = () => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    // Filter state
    const [filterState, setFilterState] = useState<FilterTasks>({
        order: 'desc',
        orderBy: 'createdAt',
        filterBy: "status",
        filterValue: undefined,
        search: ''
    });

    const fetchTasks = async (filters: FilterTasks) => {
        setIsLoading(true);
        try {
            const params = {
                order: filters.order,
                orderBy: filters.orderBy,
                search: filters.search,
                filterBy: filters.filterBy,
                filterValue: filters.filterValue
            };
            const response = await api.get(API_URLS.tasks, { params });
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        } finally {
            setIsLoading(false);
        }
    };

    // const fetchTasksDebounce = debounce(fetchTasks, 5000);

    const fetchTasksDebounced = useMemo(() => debounce(fetchTasks, 1000), []);


    const fetchUsers = async () => {
        try {
            const response = await api.get(API_URLS.getAllUsers());
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const clearFilters = () => {
        setFilterState({
            order: 'desc',
            orderBy: 'createdAt',
            filterBy: "status",
            filterValue: undefined,
            search: ''
        });
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
                // fetchTasks();
            } catch (error) {
                console.error('Failed to delete task', error);
            }
        }
    };

    const handleTaskSaved = () => {
        fetchTasks(filterState);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchTasksDebounced(filterState);
    }, [filterState, fetchTasksDebounced]);

    useEffect(() => {
        if (!socket) return;

        socket.on('taskUpdated', (updatedTask: Task) => {
            setTasks((prevTasks: Task[]) => {
                const taskExists = prevTasks.find(t => t.id === updatedTask.id);
                if (taskExists) {
                    return prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t);
                } else {
                    return [updatedTask, ...prevTasks];
                }
            });
        });

        socket.on('taskDeleted', (deletedTaskId: string) => {
            setTasks((prevTasks) => prevTasks.filter(t => t.id !== deletedTaskId));
        });

        return () => {
            socket.off('taskUpdated');
            socket.off('taskDeleted');
        };
    }, [socket, user]);


    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <h2 className="text-2xl font-bold text-gray-900">My Tasks</h2>
                    <Button onClick={handleCreateTask}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                </div>
                <TaskFilters
                    filterState={filterState}
                    setFilterState={setFilterState}
                    clearFilters={clearFilters}
                    users={users}
                />

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
                        <p className="mt-2 text-gray-500">Try adjusting your search or filters.</p>
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
