import React from 'react';
import { Dropdown, Menu, Button, Spin } from 'antd';
import { translations } from 'locales/translations';
import { IoEllipsisHorizontal } from 'react-icons/io5';
import styled from 'styled-components';
import { Notification } from 'types/Notification';
import { NotificationItem } from './NotificationItem';
import { media } from 'styles/media';
import { StyleConstants } from 'styles/StyleConstants';

interface NotificationList {
    notifications: Notification[],
    loadMore: Function,
    outOfData: boolean,
    pagination: any,
    isLoading: boolean,
    renderAsPage?: boolean
}

export const NotificationList = (props: NotificationList) => {

    const { notifications, loadMore, outOfData, pagination, isLoading, renderAsPage } = props;

    const renderNotificationItems = () => {
        return notifications.map(notification => <NotificationItem notification={notification} />)
    }

    const menu = (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    Mark all as read
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    Notification Settings
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                    Open Notification Center
                </a>
            </Menu.Item>
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
            <NotificationTitle>Notifications</NotificationTitle>
            <NotificationOptionWrapper overlay={menu} placement="bottomCenter" icon={<StyledOptionsButton />}>
            </NotificationOptionWrapper>
        </NotificationHeaderWrapper>

        <NotificationListWrapper>
            {renderNotificationItems()}
        </NotificationListWrapper>
        {canLoadMore() && <NotificationLoadMoreWrapper>
            <Button onClick={loadMoreNotifications} type="link">See more</Button>
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
`;

const WrapperAsPage = styled.div`
    width: 100%;px
    background: #fff;
    margin-top: calc(${StyleConstants.NAV_BAR_HEIGHT} + 25px);

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