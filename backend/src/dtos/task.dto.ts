import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsUUID } from 'class-validator';
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
