import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import notificationRoutes from './routes/notificationRoutes';
import { createServer } from 'http';
import { initSocket } from './services/socketService';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:5173"];

initSocket(httpServer);

app.use(cors({
    origin: (origin, callback) => {
        if (ALLOWED_ORIGINS.includes(origin || '')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('API is running');
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
