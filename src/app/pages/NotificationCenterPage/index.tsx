import React from 'react';
import { NotificationList } from 'app/components/Notification/components/NotificationList';
import { getUserNotifications } from 'services/live-data-server/notifications';
import { Notification } from 'types/Notification';
import { Row } from 'antd';

export const NotificationCenterPage = () => {
    const [pagination, setPagination] = React.useState<{ page: number, count: number, size: number, rows: Notification[] }>({
        page: 1,
        size: 10,
        count: 0,
        rows: []
    });
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [outOfData, setOutOfData] = React.useState<boolean>(false);

    const getNotifications = async (page, size) => {
        if (outOfData) return;

        setIsLoading(true);
        const response = await getUserNotifications(page, size);
        setIsLoading(false);

        if (response.success) {
            if (response.data.rows.length === 0) setOutOfData(true);
            setPagination({
                page: page,
                size: size,
                count: response.data.count,
                rows: [...pagination.rows, ...response.data.rows]
            });
        }
    }

    const loadMore = async () => {
        getNotifications(pagination.page + 1, pagination.size);
    }

    React.useEffect(() => {
        getNotifications(pagination.page, pagination.size);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
            <NotificationList
                renderAsPage
                loadMore={loadMore}
                outOfData={outOfData}
                pagination={pagination}
                isLoading={isLoading}
                notifications={pagination.rows} />
        </Row>
    );
}