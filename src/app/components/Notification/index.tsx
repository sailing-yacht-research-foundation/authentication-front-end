import React from 'react';
import styled from 'styled-components';
import { MdNotifications } from 'react-icons/md';
import { StyleConstants } from 'styles/StyleConstants';
import { NotificationList } from './components/NotificationList';
import { Dropdown } from 'antd';
import { getUserNotifications } from 'services/live-data-server/notifications';
import { Notification } from 'types/Notification';
import { isMobile } from 'react-device-detect';
import { useHistory } from 'react-router-dom';
import { media } from 'styles/media';
import { useDispatch, useSelector } from 'react-redux';
import { selectUnreadNotificationsCount } from './slice/selectors';
import { useNotificationSlice } from './slice';

export const UserNotification = () => {

    const [pagination, setPagination] = React.useState<{ page: number, count: number, size: number, rows: Notification[] }>({
        page: 1,
        size: 10,
        count: 0,
        rows: []
    });
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [outOfData, setOutOfData] = React.useState<boolean>(false);

    const numberOfUnreadNotifications = useSelector(selectUnreadNotificationsCount);

    const dispatch = useDispatch();

    const { actions } = useNotificationSlice();

    const history = useHistory();

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

    const navigateToNotificationCenter = () => {
        history.push('/notifications');
    }

    React.useEffect(() => {
        getNotifications(pagination.page, pagination.size);
        dispatch(actions.getNotificationUnreadCount());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isMobile ? (<NotificationButtonWrapperMobile onClick={navigateToNotificationCenter}>
                <NotificationIconWrapper>
                    <StyledNotificationButton />
                    {numberOfUnreadNotifications > 0 && <NumberOfNotifications>{numberOfUnreadNotifications}</NumberOfNotifications>}
                </NotificationIconWrapper>
            </NotificationButtonWrapperMobile>) : (<NotificationButtonWrapper
                placement="bottomCenter"
                trigger={['hover']}
                icon={
                    <NotificationIconWrapper>
                        <StyledNotificationButton />
                        {numberOfUnreadNotifications > 0 && <NumberOfNotifications>{numberOfUnreadNotifications}</NumberOfNotifications>}
                    </NotificationIconWrapper>
                }
                overlay={
                    <NotificationList
                        loadMore={loadMore}
                        outOfData={outOfData}
                        pagination={pagination}
                        isLoading={isLoading}
                        notifications={pagination.rows} />}>
            </NotificationButtonWrapper>)}
        </>
    );
}

const NotificationButtonWrapperMobile = styled.div`
    display: block;
    line-height: 0;
    margin-top: 20px;
    margin-left: -20px;
    position: relative;
    left: -10px;
`;

const NotificationButtonWrapper = styled(Dropdown.Button)`
    display: block;
    position: relative;
    left: -20px;

    button {
        border: none;
        &:after {
            display: none;
        }
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
    right: 0px;
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
    white-space: nowrap;
    cursor: pointer;

    ${media.medium`
        right: 10px;
    `};
`;
