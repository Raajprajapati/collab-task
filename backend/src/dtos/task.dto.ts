import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsUUID, IsArray } from 'class-validator';
import { Priority, Status } from '../../generated/prisma/client';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    dueDate?: string;

    @IsEnum(Priority)
    @IsOptional()
    priority?: Priority;

    @IsEnum(Status)
    @IsOptional()
    status?: Status;

    @IsUUID()
    @IsOptional()
    assignedToId?: string;
}

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    dueDate?: string;

    @IsEnum(Priority)
    @IsOptional()
    priority?: Priority;

    @IsEnum(Status)
    @IsOptional()
    status?: Status;

    @IsUUID()
    @IsOptional()
    assignedToId?: string;
}


export class FilterTasksDto {
    @IsEnum(["asc", "desc"])
    @IsOptional()
    order?: "asc" | "desc";

    @IsEnum(["createdAt", "dueDate"])
    @IsOptional()
    orderBy?: "createdAt" | "dueDate";

    @IsArray()
    @IsOptional()
    filters?: Array<{ key: "status" | "priority" | "assignedToId" | "creatorId" | "overdue", value: string }>;

    @IsString()
    @IsOptional()
    search?: string;
}