export interface FilterTasks {
    order?: "asc" | "desc",
    orderBy?: "createdAt" | "dueDate",
    filters?: Array<{ key: "status" | "priority" | "assignedToId" | "creatorId" | "overdue", value: string }>,
    search?: string
}