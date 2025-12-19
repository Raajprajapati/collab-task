import { useEffect, useState } from "react";
import { API_URLS } from "../utils/apiUrls";
import api from "../services/api";
import type { Notification } from "../types";
import { Button } from "./ui/Button";
import { X } from "lucide-react";
import formatTime from "../utils/formatTime";

const NotificationsModal = ({ setIsNotificationsOpen }: { setIsNotificationsOpen: (open: boolean) => void }) => {

    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchNotifications = async (type: 'new' | 'old') => {
        try {
            const url = type === 'new' ? API_URLS.notifications : API_URLS.oldNotifications;
            const response = await api.get(url);
            setNotifications(response.data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        }
    };

    const markAsRead = async () => {
        try {
            await api.put(API_URLS.markNotificationAsRead);
            fetchNotifications('new');
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    useEffect(() => {
        fetchNotifications('new');
    }, []);

    return (
        <div onClick={() => setIsNotificationsOpen(false)} className="fixed inset-0 z-40 bg-black/50">
            <div className="fixed right-0 top-0 z-50 h-screen w-96 overflow-y-auto bg-white p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Notifications</h2>
                    {notifications.filter((notification) => !notification.read).length > 0 && <Button onClick={markAsRead} variant="ghost">
                        Mark all as read
                    </Button>}
                    <Button onClick={() => setIsNotificationsOpen(false)} variant="ghost">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="mt-4">
                    {notifications.map((notification) => (
                        <div key={notification.id}>
                            <p>{notification.message}</p>
                            <p>{formatTime(notification.createdAt)}</p>
                        </div>
                    ))}
                    {notifications.length === 0 && (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-center text-gray-500 mt-6 text-sm">No new notifications</p>
                            <Button onClick={() => fetchNotifications('old')} variant="outline" className="mt-4 px-3 py-1">
                                <span className="text-xs">View Older</span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsModal;