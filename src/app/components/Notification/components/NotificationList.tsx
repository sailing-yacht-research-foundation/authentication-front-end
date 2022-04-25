import React from 'react';
import { Dropdown, Menu, Button, Spin } from 'antd';
import { translations } from 'locales/translations';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import styled from 'styled-components';
import { Notification } from 'types/Notification';
import { NotificationItem } from './NotificationItem';
import { media } from 'styles/media';
import { StyleConstants } from 'styles/StyleConstants';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { LottieMessage } from 'app/components/SyrfGeneral';
import Lottie from 'react-lottie';
import NoResult from '../assets/noresult.json';
import { useDispatch } from 'react-redux';
import { useNotificationSlice } from '../slice';

interface INotificationList {
    notifications: Notification[],
    loadMore: Function,
    outOfData: boolean,
    pagination: any,
    isLoading: boolean,
    renderAsPage?: boolean,
    showFullNotificationContent?: boolean
}

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const NotificationList = (props: INotificationList) => {

    const { t } = useTranslation();

    const { notifications, loadMore, outOfData, pagination, isLoading, renderAsPage, showFullNotificationContent } = props;

    const history = useHistory();

    const dispatch = useDispatch();

    const { actions } = useNotificationSlice();

    const renderNotificationItems = () => {
        if (notifications.length > 0)
            return notifications.map(notification => <NotificationItem showFullNotificationContent={showFullNotificationContent} notification={notification} />);

        return <LottieWrapper>
            <Lottie
                options={defaultOptions}
                height={150}
                width={150} />
            <LottieMessage>{t(translations.notifications.you_dont_have_any_notifications)}</LottieMessage>
        </LottieWrapper>
    }

    const navigateToSettings = () => {
        history.push('/account/settings');
    }

    const navigateToNotificationsPage = () => {
        history.push('/notifications');
    }

    const markAllAsRead = () => {
        dispatch(actions.markAllAsRead());
    }

    const menu = (
        <Menu>
            <Menu.Item onClick={markAllAsRead}>
                {t(translations.notifications.mark_all_as_read)}
            </Menu.Item>
            <Menu.Item onClick={navigateToSettings}>
                {t(translations.notifications.notification_settings)}
            </Menu.Item>
            {!renderAsPage && <Menu.Item onClick={navigateToNotificationsPage}>
                {t(translations.notifications.open_notification_center)}
            </Menu.Item>}
        </Menu>
    );

    const loadMoreNotifications = (e) => {
        e.stopPropagation();
        loadMore();
    }

    const canLoadMore = () => {
        return !outOfData && notifications.length >= pagination.size;
    }

    const NotificationListContent = () => <Spin spinning={isLoading}>
        <NotificationHeaderWrapper>
            <NotificationTitle>{t(translations.notifications.notifications)}</NotificationTitle>
            <NotificationOptionWrapper overlay={menu} placement="bottomCenter" icon={<StyledOptionsButton />}>
            </NotificationOptionWrapper>
        </NotificationHeaderWrapper>

        <NotificationListWrapper>
            {renderNotificationItems()}
        </NotificationListWrapper>
        {canLoadMore() && <NotificationLoadMoreWrapper>
            <Button onClick={loadMoreNotifications} type="link">{t(translations.notifications.see_more)}</Button>
        </NotificationLoadMoreWrapper>}
    </Spin>;

    return (
        <>
            {!renderAsPage ?
                (<Wrapper>{NotificationListContent()}</Wrapper >) :
                (<WrapperAsPage>{NotificationListContent()}</WrapperAsPage>)}
        </>
    );
}

const NotificationOptionWrapper = styled(Dropdown.Button)`
    button {
        border: none;
    }
`;

const StyledOptionsButton = styled(IoEllipsisHorizontal)`
    font-size: 22px;
`;

const NotificationHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 15px;
    align-items: center;
`;

const NotificationTitle = styled.h3`
    font-weight: bold;
    font-size: 18px;
    line-height: 50px;
    margin-bottom: 0;
`;

const Wrapper = styled.div`
    background: #fff;
    box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2),0 2px 4px 0 rgba(0, 0, 0, 0.1),inset 0 0 0 1px rgba(255,255,255,0.5);
    width: 360px;
    border-radius: 5px;
    padding: 5px;
    max-height: 500px;
    overflow-y: auto;
`;

const WrapperAsPage = styled.div`
    width: 100%;
    background: #fff;
    margin-top: calc(${StyleConstants.NAV_BAR_HEIGHT} + 25px);
    padding: 10px;

    ${media.medium`
        width: 55%;
    `}; 
`;

const NotificationListWrapper = styled.div`
    margin-top: 10px;
`;

const NotificationLoadMoreWrapper = styled.div`
    display: block;
    text-align: center;
    padding: 10px 0;
`;

const LottieWrapper = styled.div`
    text-align: center;
    margin-top: 15px;

    > div {
        width: 100% !important;
        height: auto !important;
    }

    ${media.medium`
        > div {
            width: 150px !important;
        }
    `}
`;