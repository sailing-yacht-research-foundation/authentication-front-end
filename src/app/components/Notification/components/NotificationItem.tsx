import React from 'react';
import styled from 'styled-components';
import { Notification } from 'types/Notification';
import moment from 'moment';
import { FollowStatus, KudoTypes, NotificationTypes } from 'utils/constants';
import Group from '../assets/group.png';
import Event from '../assets/event.png';
import Follow from '../assets/follow.png';
import Sail from '../assets/sail.png';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { StyleConstants } from 'styles/StyleConstants';
import { markNotificationsAsRead } from 'services/live-data-server/notifications';
import { useHistory } from 'react-router-dom';
import { useSocialSlice } from 'app/components/SocialProfile/slice';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillNotification, AiOutlineGlobal, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { MdAdminPanelSettings, MdEventBusy, MdGroupAdd, MdOutgoingMail } from 'react-icons/md';
import { GiAchievement } from 'react-icons/gi';
import { VscDebugStart } from 'react-icons/vsc';
import { IoCreateSharp, IoShieldCheckmark } from 'react-icons/io5';
import { BsPersonPlus } from 'react-icons/bs';
import { useNotificationSlice } from '../slice';
import { renderAvatar } from 'utils/user-utils';
import { selectMarkAllAsReadSuccess } from '../slice/selectors';
import { AiFillHeart, AiFillStar } from 'react-icons/ai';
import { FaHandsWash, FaRobot } from 'react-icons/fa';
import { IoThumbsUp } from 'react-icons/io5';
import { IoIosWarning } from 'react-icons/io';
import { Button } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

const notificationColor = {
    DELETE: '#DC6E1E',
    FOLLOW: '#16a085',
    ADD: '#95e1c1',
    DEFAULT: '#40a9ff',
    LIKE: '#2980b9',
    HEART: '#e74c3c',
    APPLAUSE: '#9b59b6',
    STAR: '#f1c40f',
    WARNING: '#ebb134',
    ANNOUNCEMENT: '#16a085'
}

export const NotificationItem = ({ notification, showFullNotificationContent }: { notification: Notification, showFullNotificationContent?: boolean }) => {

    const [isRead, setIsRead] = React.useState<boolean>(false);

    const history = useHistory();

    const { actions } = useSocialSlice();

    const notificationActions = useNotificationSlice().actions;

    const markAllAsReadSuccess = useSelector(selectMarkAllAsReadSuccess);

    const [isShowFull, setIsShowFull] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    const { t } = useTranslation();

    React.useEffect(() => {
        if (markAllAsReadSuccess)
            setIsRead(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markAllAsReadSuccess]);

    React.useEffect(() => {
        setIsRead(!!notification.readAt);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderNotificationBadge = () => {
        let icon, color = notificationColor.DEFAULT;
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
                color = notificationColor.DELETE;
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
                color = notificationColor.FOLLOW;
                icon = <BsPersonPlus />;
                break;
            case NotificationTypes.EVENT_INACTIVITY_WARNING:
                color = notificationColor.WARNING;
                icon = <IoIosWarning />;
                break;
            case NotificationTypes.KUDOS_RECEIVED:
                switch (notification.metadata.kudosType) {
                    case KudoTypes.HEART:
                        icon = <AiFillHeart />;
                        color = notificationColor.HEART
                        break;
                    case KudoTypes.THUMBS_UP:
                        icon = <IoThumbsUp />;
                        color = notificationColor.LIKE
                        break;
                    case KudoTypes.STAR:
                        icon = <AiFillStar />
                        color = notificationColor.STAR
                        break;
                    case KudoTypes.APPLAUSE:
                        icon = <FaHandsWash />
                        color = notificationColor.APPLAUSE
                }
                break;
            case NotificationTypes.EVENT_MESSAGES_RECEIVED:
                icon = <AiFillNotification />
                color = notificationColor.ANNOUNCEMENT
                break;
            case NotificationTypes.SIMULATION_DELETION:
                icon = <FaRobot />
                color = notificationColor.WARNING
                break;
            default:
                icon = <AiOutlineGlobal />;
        }

        return <NotificationBadge style={{ background: color }}>
            {icon}
        </NotificationBadge>
    }

    const renderNotificationAvatar = () => {
        const thumbnail = notification.notificationThumbnail || notification.metadata?.notificationThumbnail;
        if (thumbnail)
            return renderAvatar(thumbnail);

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
            case NotificationTypes.EVENT_INACTIVITY_WARNING:
            case NotificationTypes.EVENT_MESSAGES_RECEIVED:
                return Event;
            case NotificationTypes.SIMULATION_DELETION:
                return Sail;
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
            case NotificationTypes.USER_ADDED_TO_EVENT_ADMIN:
            case NotificationTypes.USER_INVITED_TO_PRIVATE_REGATTA:
            case NotificationTypes.OPEN_EVENT_NEARBY_CREATED:
            case NotificationTypes.EVENT_INACTIVITY_WARNING:
            case NotificationTypes.EVENT_MESSAGES_RECEIVED:
                history.push(`/events/${notification.metadata?.calendarEventId}`);
                break;
            case NotificationTypes.USER_NEW_FOLLOWER:
                history.push(`/profile/${notification.metadata?.followerId}`);
                if (notification.metadata?.status === FollowStatus.REQUESTED) {
                    dispatch(actions.setShowFollowRequestModal(true));
                }
                break;
            case NotificationTypes.KUDOS_RECEIVED:
                history.push(`/playback?raceId=${notification.metadata?.competitionUnitId}`);
                break;
        }

        markAsRead(e);
    }

    const showFullNotificationDetail = (e) => {
        e.stopPropagation();
        setIsShowFull(true);
    }

    const renderNotificationDetail = () => {
        if (notification.notificationMessage.length > 150 && !isShowFull && !showFullNotificationContent)
            return <NotificationItemDetail>
                {notification.notificationMessage.substring(0, 150)}
                <Button style={{ paddingLeft: '0' }} type='link' onClick={showFullNotificationDetail}>...{t(translations.notifications.see_more)}</Button>
            </NotificationItemDetail>

        return <NotificationItemDetail>{notification.notificationMessage}</NotificationItemDetail>
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
                {renderNotificationDetail()}
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
    top: 17px;
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
`;