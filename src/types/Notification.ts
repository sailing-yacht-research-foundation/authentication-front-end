import { NotificationTypes } from "utils/constants";
export interface Notification {
    id: string;
    userId: string;
    notificationType: NotificationTypes;
    notificationTitle: string;
    notificationMessage: string;
    metadata: any;
    createdAt: Date;
    readAt?: Date;
}
