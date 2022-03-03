import React from 'react';
import styled from 'styled-components';
import { MdNotifications } from 'react-icons/md';
import { StyleConstants } from 'styles/StyleConstants';
import { NotificationList } from './components/NotificationList';
import { Dropdown, Spin } from 'antd';
import { getUserNotifications } from 'services/live-data-server/notifications';
import { Notification } from 'types/Notification';

export const UserNotification = () => {

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
    }, []);

    return (
        <NotificationButtonWrapper
            placement="bottomCenter"
            trigger={['hover']}
            icon={
                <NotificationIconWrapper>
                    <StyledNotificationButton />
                    {pagination.count > 0 && <NumberOfNotifications>{pagination.count}</NumberOfNotifications>}
                </NotificationIconWrapper>
            }
            overlay={
                <NotificationList
                    loadMore={loadMore}
                    outOfData={outOfData}
                    pagination={pagination}
                    isLoading={isLoading}
                    notifications={pagination.rows} />}>
        </NotificationButtonWrapper>
    );
}

const NotificationButtonWrapper = styled(Dropdown.Button)`
    display: block;

    button {
        border: none;
    }
`;

const StyledNotificationButton = styled(MdNotifications)`
    color: #1890ff;
    font-size: 25px;
    cursor: pointer;
    margin-left: -30px;

    &:hover {
    color: ${StyleConstants.MAIN_TONE_COLOR};
    }
`;

const NotificationIconWrapper = styled.div`
    position: relative;
`;

const NumberOfNotifications = styled.div`
    position: absolute;
    right: 10px;
    background: #DC6E1E;
    padding: 2px 3px;
    font-size: 10px;
    top: -5px;
    border-radius: 5px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
`;
