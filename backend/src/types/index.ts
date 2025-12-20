export interface FilterTasks {
    order?: "asc" | "desc",
    orderBy?: "createdAt" | "dueDate",
    filterBy?: "status" | "priority" | "assignedToId" | "creatorId" | "overdue",
    filterValue?: string,
    search?: string
}