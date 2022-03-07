import React from 'react';
import styled from 'styled-components';
import { Notification } from 'types/Notification';
import moment from 'moment';
import { FollowStatus, NotificationTypes } from 'utils/constants';
import Group from '../assets/group.png';
import Event from '../assets/event.png';
import Follow from '../assets/follow.png';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { StyleConstants } from 'styles/StyleConstants';
import { markNotificationsAsRead } from 'services/live-data-server/notifications';
import { useHistory } from 'react-router-dom';
import { useSocialSlice } from 'app/components/SocialProfile/slice';
import { useDispatch } from 'react-redux';
import { AiOutlineGlobal, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { MdAdminPanelSettings, MdEventBusy, MdGroupAdd, MdOutgoingMail } from 'react-icons/md';
import { GiAchievement } from 'react-icons/gi';
import { VscDebugStart } from 'react-icons/vsc';
import { IoCreateSharp, IoShieldCheckmark } from 'react-icons/io5';
import { BsPersonPlus } from 'react-icons/bs';
import { useNotificationSlice } from '../slice';
import { renderAvatar } from 'utils/user-utils';

export const NotificationItem = ({ notification }: { notification: Notification }) => {

    const [isRead, setIsRead] = React.useState<boolean>(false);

    const history = useHistory();

    const { actions } = useSocialSlice();

    const notificationActions = useNotificationSlice().actions;

    const dispatch = useDispatch();

    React.useEffect(() => {
        setIsRead(!!notification.readAt);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderNotificationBadge = () => {
        let icon, className = '';
        switch (notification.notificationType) {
            case NotificationTypes.USER_INVITED_TO_GROUP:
                icon = <AiOutlineUsergroupAdd />;
                break;
            case NotificationTypes.REQUEST_JOIN_GROUP:
                icon = <MdGroupAdd />;
                break;
            case NotificationTypes.USER_ADDED_TO_GROUP_ADMIN:
                icon = <MdAdminPanelSettings />;
                break;
            case NotificationTypes.GROUP_ACHIEVE_BADGE:
                icon = <GiAchievement />;
                break;
            case NotificationTypes.COMPETITION_START_TRACKING:
                icon = <VscDebugStart />;
                break;
            case NotificationTypes.EVENT_INACTIVITY_DELETION:
                className = 'delete';
                icon = <MdEventBusy />;
                break;
            case NotificationTypes.USER_ADDED_TO_EVENT_ADMIN:
                icon = <IoShieldCheckmark />;
                break;
            case NotificationTypes.USER_INVITED_TO_PRIVATE_REGATTA:
                icon = <MdOutgoingMail />;
                break;
            case NotificationTypes.OPEN_EVENT_NEARBY_CREATED:
                icon = <IoCreateSharp />;
                break;
            case NotificationTypes.USER_NEW_FOLLOWER:
                className = 'follow';
                icon = <BsPersonPlus />;
                break;
            default:
                icon = <AiOutlineGlobal />;
        }

        return <NotificationBadge className={className}>
            {icon}
        </NotificationBadge>
    }

    const renderNotificationAvatar = () => {
        if (notification.notificationThumbnail)
            return renderAvatar(notification.notificationThumbnail);

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

        if (isRead) return;

        const response = await markNotificationsAsRead([notification.id]);

        if (response.success) {
            setIsRead(true);
            dispatch(notificationActions.getNotificationUnreadCount());
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
                if (notification.metadata?.status === FollowStatus.REQUESTED) {
                    dispatch(actions.setShowFollowRequestModal(true));
                }
                break;
        }

        markAsRead(e);
    }

    return (
        <NotificationItemWrapper onClick={navigateToTarget}>
            <NotificationItemAvatarWrapper>
                <NotificationItemAvatarContainer>
                    <img alt={notification.notificationTitle} src={renderNotificationAvatar()} className='avatar-img' />
                </NotificationItemAvatarContainer>
                {renderNotificationBadge()}
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

const NotificationItemAvatarWrapper = styled.div`
    position: relative;
`;

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

const NotificationBadge = styled.div`
    position: absolute;
    right: 0;
    top: 40px;
    font-size: 16px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background: #40a9ff;
    box-shadow: 0 12px 28px 0 rgba(0,0,0,0.2),0 2px 4px 0 rgba(0,0,0,0.1),inset 0 0 0 1px rgba(255,255,255,0.5);

    &.delete {
        background: #DC6E1E;
    }

    &.follow {
        background: #16a085;
    }

    &.add {
        background: #95e1c1;
    }
`;