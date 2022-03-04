import React from 'react';
import styled from 'styled-components';
import { Notification } from 'types/Notification';
import moment from 'moment';
import { NotificationTypes } from 'utils/constants';
import Group from '../assets/group.png';
import Event from '../assets/event.png';
import Follow from '../assets/follow.png';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { StyleConstants } from 'styles/StyleConstants';
import { markNotificationsAsRead } from 'services/live-data-server/notifications';
import { useHistory } from 'react-router-dom';
import { useSocialSlice } from 'app/components/SocialProfile/slice';
import { useDispatch } from 'react-redux';

export const NotificationItem = ({ notification }: { notification: Notification }) => {

    const [isRead, setIsRead] = React.useState<boolean>(false);

    const history = useHistory();

    const { actions } = useSocialSlice();

    const dispatch = useDispatch();

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

    const navigateToTarget = (e) => {
        switch (notification.notificationType) {
            case NotificationTypes.USER_INVITED_TO_GROUP:
                history.push(`/groups`);
                break;
            case NotificationTypes.REQUEST_JOIN_GROUP:
            case NotificationTypes.USER_ADDED_TO_GROUP_ADMIN:
            case NotificationTypes.GROUP_ACHIEVE_BADGE:
                history.push(`/groups/${notification.metadata?.groupId}`);
                break;
            case NotificationTypes.COMPETITION_START_TRACKING:
            case NotificationTypes.EVENT_INACTIVITY_DELETION:
            case NotificationTypes.USER_ADDED_TO_EVENT_ADMIN:
            case NotificationTypes.USER_INVITED_TO_PRIVATE_REGATTA:
            case NotificationTypes.OPEN_EVENT_NEARBY_CREATED:
                history.push(`/events/${notification.metadata?.calendarEventId}`);
                break;
            case NotificationTypes.USER_NEW_FOLLOWER:
                history.push(`/profile/${notification.metadata?.followerId}`);
                dispatch(actions.setShowFollowRequestModal(true));
                break;
        }

        markAsRead(e);
    }

    return (
        <NotificationItemWrapper onClick={navigateToTarget}>
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
    padding: 10px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
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
    padding-right: 20px;
    font-weight: 600;
`;

const NotificationItemDetail = styled.div`
    color: #0b0e1f;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px;
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    word-wrap: break-word; 
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
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid #eee;
`;

const ReadButton = styled.div`
    top: 13px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${StyleConstants.MAIN_TONE_COLOR};
    position: absolute;
    right: 10px;
`;