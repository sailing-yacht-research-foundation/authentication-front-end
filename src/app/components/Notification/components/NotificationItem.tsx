import React from 'react';
import styled from 'styled-components';
import { Notification } from 'types/Notification';
import moment from 'moment';
import { NotificationTypes } from 'utils/constants';
import Group from '../assets/group.png';
import Event from '../assets/event.png';
import Follow from '../assets/follow.png';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { StyleConstants } from 'styles/StyleConstants';
import { markNotificationsAsRead } from 'services/live-data-server/notifications';

export const NotificationItem = ({ notification }: { notification: Notification }) => {

    const { t } = useTranslation();

    const [isRead, setIsRead] = React.useState<boolean>(false);

    React.useEffect(() => {
        setIsRead(!!notification.readAt);
    }, []);

    const renderNotificationAvatar = () => {
        switch (notification.notificationType) {
            case NotificationTypes.USER_INVITED_TO_GROUP:
            case NotificationTypes.REQUEST_JOIN_GROUP:
            case NotificationTypes.USER_ADDED_TO_GROUP_ADMIN:
            case NotificationTypes.GROUP_ACHIEVE_BADGE:
                return Group;
            case NotificationTypes.COMPETITION_START_TRACKING:
            case NotificationTypes.EVENT_INACTIVITY_DELETION:
            case NotificationTypes.USER_ADDED_TO_EVENT_ADMIN:
            case NotificationTypes.USER_INVITED_TO_PRIVATE_REGATTA:
            case NotificationTypes.OPEN_EVENT_NEARBY_CREATED:
                return Event;
            case NotificationTypes.USER_NEW_FOLLOWER:
                return Follow;
        }
    }

    const markAsRead = async (e) => {
        e.stopPropagation();
        const response = await markNotificationsAsRead([notification.id]);

        if (response.success) {
            setIsRead(true)
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <NotificationItemWrapper>
            <NotificationItemAvatarWrapper>
                <NotificationItemAvatarContainer>
                    <img src={renderNotificationAvatar()} className='avatar-img' />
                </NotificationItemAvatarContainer>
            </NotificationItemAvatarWrapper>
            <NotificationItemInfo>
                <NotificationItemTitle>{notification.notificationTitle}</NotificationItemTitle>
                {!isRead && <ReadButton onClick={markAsRead} />}
                <NotificationItemDetail>{notification.notificationMessage}</NotificationItemDetail>
                <NotificationItemTime>{moment(notification.createdAt).fromNow()}</NotificationItemTime>
            </NotificationItemInfo>
        </NotificationItemWrapper>
    )
}

const NotificationItemWrapper = styled.div`
    display: flex;
    padding: 5px;
    cursor: pointer;
    position: relative;
`;

const NotificationItemAvatarWrapper = styled.div``;

const NotificationItemInfo = styled.div`
    margin-left: 10px;
`;

const NotificationItemTitle = styled.span`
    color: #646d7d;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    margin-right: 8px;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
`;

const NotificationItemDetail = styled.div`
    color: #0b0e1f;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const NotificationItemTime = styled.span`
    color: #646d7d;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    height: 20px;
    line-height: 20px;
    margin-bottom: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const NotificationItemAvatarContainer = styled.div`
    width: 55px;
    height: 55px;
    border-radius: 50%;
    border: 1px solid #eee;
`;

const ReadButton = styled.div`
    top: 10px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${StyleConstants.MAIN_TONE_COLOR};
    position: absolute;
    right: 10px;
`;