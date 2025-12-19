export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_URLS = {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    details: `${API_BASE_URL}/auth/details`,
    tasks: `${API_BASE_URL}/tasks`,
    getTaskById(id: string): string {
        return `${API_BASE_URL}/tasks/${id}`;
    },
    createTask: `${API_BASE_URL}/tasks`,
    updateTask(id: string): string {
        return `${API_BASE_URL}/tasks/${id}`;
    },
    deleteTask(id: string): string {
        return `${API_BASE_URL}/tasks/${id}`;
    },
    getAllUsers(): string {
        return `${API_BASE_URL}/users/all`;
    }
}

