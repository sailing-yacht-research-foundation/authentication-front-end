/* --- STATE --- */
export interface NotificationState {
    unreadCount: number;
    markAllAsReadSuccess: boolean;
}

export type ContainerState = NotificationState
