import { Calendar, Edit2, Trash2, User, AlertCircle } from "lucide-react"
import { getPriorityColor } from "../utils/taskts"
import { Status } from "../types";
import type { Task } from "../types";
import { cn } from "../utils/cn";
import { Button } from "./ui/Button";
import formatTime from "../utils/formatTime";

interface TaskCardProps {
    task: Task;
    handleEditTask: (task: Task) => void;
    handleDeleteTask: (taskId: string) => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'TODO':
            return 'bg-gray-100 text-gray-800';
        case 'IN_PROGRESS':
            return 'bg-blue-100 text-blue-800';
        case 'REVIEW':
            return 'bg-yellow-100 text-yellow-800';
        case 'COMPLETED':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const TaskCard: React.FC<TaskCardProps> = ({ task, handleEditTask, handleDeleteTask }) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== Status.COMPLETED;

    return (
        <div
            key={task.id}
            className="flex flex-col rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
            <div className="mb-4 flex items-start justify-between">
                <div className="flex gap-2">
                    <span
                        className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            getPriorityColor(task.priority)
                        )}
                    >
                        {task.priority}
                    </span>
                    <span
                        className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            getStatusColor(task.status)
                        )}
                    >
                        {task.status.replace('_', ' ')}
                    </span>
                </div>
                <div className="flex space-x-2">
                    <Button
                        onClick={() => handleEditTask(task)}
                        variant="ghost"
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={() => handleDeleteTask(task.id)}
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 "
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <h3 className="mb-2 text-lg font-semibold text-gray-900">{task.title}</h3>
            <p className="mb-4 flex-1 text-sm text-gray-600 line-clamp-3">
                {task.description}
            </p>

            <div className="mt-auto flex flex-col gap-2 border-t pt-4 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {task.dueDate ? formatTime(task.dueDate) : 'No due date'}
                    </div>
                    {isOverdue && (
                        <span className="flex items-center text-red-600 font-medium">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Overdue
                        </span>
                    )}
                </div>
                <div className="flex items-center mt-2">
                    <User className="mr-1 h-3 w-3" />
                    <span className="text-xs text-gray-600">{(task.assignedTo?.name ? "Assigned to " + task.assignedTo?.name : "Unassigned")}</span>
                </div>
            </div>
        </div>
    )
}
export default TaskCard;