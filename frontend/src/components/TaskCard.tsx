import { Calendar, Edit2, Flag, Trash2 } from "lucide-react"
import { getPriorityColor } from "../utils/taskts"
import type { Task } from "../types";
import { cn } from "../utils/cn";
import { Button } from "./ui/Button";

interface TaskCardProps {
    task: Task;
    handleEditTask: (task: Task) => void;
    handleDeleteTask: (taskId: string) => void;
}
const TaskCard: React.FC<TaskCardProps> = ({ task, handleEditTask, handleDeleteTask }) => {


    return (
        <div
            key={task.id}
            className="flex flex-col rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
            <div className="mb-4 flex items-start justify-between">
                <span
                    className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        getPriorityColor(task.priority)
                    )}
                >
                    {task.priority}
                </span>
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

            <div className="mt-auto flex items-center justify-between border-t pt-4 text-xs text-gray-500">
                <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                </div>
                <div className="flex items-center">
                    <Flag className="mr-1 h-3 w-3" />
                    {task.status.replace('_', ' ')}
                </div>
            </div>
        </div>
    )
}
export default TaskCard;