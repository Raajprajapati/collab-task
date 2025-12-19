import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

export class SocketService {
    private static io: SocketIOServer;

    static initSocket = (httpServer: HttpServer) => {
        if (SocketService.io) return SocketService.io;
        SocketService.io = new SocketIOServer(httpServer, {
            cors: {
                origin: (origin, callback) => {
                    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"];
                    if (origin && allowedOrigins.includes(origin)) {
                        callback(null, true);
                    } else {
                        callback(new Error("Not allowed by CORS. Socket Error"));
                    }
                },
                methods: ["GET", "POST"],
                credentials: true
            }
        });

        SocketService.io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        return SocketService.io;
    };

    static getIO = () => {
        if (!SocketService.io) {
            throw new Error('Socket.io not initialized!');
        }
        return SocketService.io;
    };

    static emitTaskUpdate = (task: any) => {
        if (SocketService.io) {
            SocketService.io.emit('taskUpdated', task);
        }
    };

    static emitNotification = (userId: string, notification: any) => {
        if (SocketService.io) {
            SocketService.io.emit(`notification_${userId}`, notification);
        }
    };
}

export const initSocket = SocketService.initSocket;
export const getIO = SocketService.getIO;
export const emitNotification = SocketService.emitNotification;
export const emitTaskUpdate = SocketService.emitTaskUpdate;


