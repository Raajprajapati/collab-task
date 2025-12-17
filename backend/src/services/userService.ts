import { UserRepository } from '../repositories/userRepository';
import { hashPassword } from '../utils/auth';
import type { User, Prisma } from '../../generated/prisma/client';
export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async registerUser(data: Prisma.UserCreateInput): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await hashPassword(data.password);
        const userData = { ...data, password: hashedPassword };

        return await this.userRepository.create(userData);
    }

    async getUserProfile(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }

    async updateUserProfile(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        return await this.userRepository.update(id, data);
    }
}
