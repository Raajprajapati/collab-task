import { Task, User } from "../../generated/prisma";

const createNotification = (user: User, updatedData: Partial<Task>, oldData?: Partial<Task> | null): null | { userId: string, message: string, read: boolean, createdAt: Date } => {

    if (user.id === updatedData.assignedToId) {
        return null;
    }

    let notification = {
        userId: user.id,
        message: `${user.name} updated task ${oldData?.title}`,
        read: false,
        createdAt: new Date(),
    }

    if (updatedData.assignedToId && !oldData?.assignedToId || updatedData.assignedToId !== oldData?.assignedToId) {
        notification.message = `${user.name} assigned you a task: ${updatedData.title}`;
    } else {
        notification.message = `${user.name} updated task ${updatedData.title}`;
    }

    return notification;
}

export default createNotification;