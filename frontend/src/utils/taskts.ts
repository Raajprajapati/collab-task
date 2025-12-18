import { Priority } from "../types";

const getPriorityColor = (priority: Priority) => {
    switch (priority) {
        case Priority.URGENT:
            return 'text-red-600 bg-red-50';
        case Priority.HIGH:
            return 'text-orange-600 bg-orange-50';
        case Priority.MEDIUM:
            return 'text-blue-600 bg-blue-50';
        case Priority.LOW:
            return 'text-green-600 bg-green-50';
        default:
            return 'text-gray-600 bg-gray-50';
    }
};

export { getPriorityColor }