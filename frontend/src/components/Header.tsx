import { Bell, BellDot, LogOut } from "lucide-react";
import { Button } from "./ui/Button";
import { useAuth } from "../context/AuthContext";
import NotificationsModal from "./NotificationsModal";
import { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";

const Header = () => {
    const { user, logout } = useAuth();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const { socket, isConnected } = useSocket();
    const [newNotification, setNewNotification] = useState(true);

    useEffect(() => {
        if (!isConnected || !socket || !user) return;
        socket.on(`notification_${user.id}`, (notification: any) => {
            console.log('New notification:', notification);
            setNewNotification(true);
        });
        return () => {
            socket.off(`notification_${user.id}`);
            setNewNotification(false);
        };
    }, [socket]);

    return (
        <nav className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900">CollabTask</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
                        <span onClick={() => setIsNotificationsOpen(true)} title={newNotification ? "You have new notifications" : "No new notifications"}>
                            {newNotification ?
                                <BellDot className="h-4 w-4 text-red-500 cursor-pointer" />
                                : <Bell className="h-4 w-4 cursor-pointer" />}
                        </span>
                        <Button variant="ghost" onClick={logout} className="text-sm">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
                {isNotificationsOpen && <NotificationsModal setIsNotificationsOpen={setIsNotificationsOpen} />}
            </div>
        </nav>
    );
};

export default Header;
