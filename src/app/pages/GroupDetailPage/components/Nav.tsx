import React from 'react';
import styled from 'styled-components';
import { Menu, Dropdown, Button, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DeleteGroupModal } from './modals/DeleteGroupModal';
import { LeaveGroupModal } from './modals/LeaveGroupModal';
import { CreateButton, GobackButton } from 'app/components/SyrfGeneral';
import { IoIosArrowBack } from 'react-icons/io';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { GroupMemberStatus } from 'utils/constants';
import { MdOutlineGroupAdd, MdOutlineUndo } from 'react-icons/md';
import { requestJoinGroup, leaveGroup } from 'services/live-data-server/groups';
import { useDispatch, useSelector } from 'react-redux';
import { useGroupDetailSlice } from '../slice';
import { selectAdminCurrentPage, selectMemberCurrentPage, selectMemberPageSize } from '../slice/selectors';
import { handleGoBack, showToastMessageOnRequestError } from 'utils/helpers';

export const Nav = (props) => {

    const { t } = useTranslation();

    const { group } = props;

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [showLeaveModal, setShowLeaveModal] = React.useState<boolean>(false);

    const history = useHistory();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [joinStatus, setJoinStatus] = React.useState<any>();

    const memberPageSize = useSelector(selectMemberPageSize);

    const dispatch = useDispatch();

    const { actions } = useGroupDetailSlice();

    const membersCurrentPage = useSelector(selectMemberCurrentPage);

    const adminsCurrentPage = useSelector(selectAdminCurrentPage);

    const showDeleteGroupModal = (e) => {
        e.preventDefault();
        setShowDeleteModal(true);
    }

    const showLeaveGroupModal = (e) => {
        e.preventDefault();
        setShowLeaveModal(true);
    }

    const joinGroup = async () => {
        setIsLoading(true);
        const response = await requestJoinGroup(group.id);
        setIsLoading(false);

        if (!response.success) {
            showToastMessageOnRequestError(response.error);
        } else {
            if (response.data.status === GroupMemberStatus.ACCEPTED) {
                dispatch(actions.getGroup(group.id));
                dispatch(actions.getAdmins({ groupId: group.id, page: adminsCurrentPage }));
                dispatch(actions.getMembers({ page: membersCurrentPage, groupId: group.id, status: GroupMemberStatus.ACCEPTED, size: memberPageSize }))
            } else {
                setJoinStatus(GroupMemberStatus.REQUESTED);
            }
        }
    }

    const undoJoin = async () => {
        setIsLoading(true);
        const response = await leaveGroup(group.id!);
        setIsLoading(false);

        if (!response.success) {
            showToastMessageOnRequestError(response.error);
        } else {
            setJoinStatus(null);
            dispatch(actions.getMembers({ page: membersCurrentPage, groupId: group.id, status: GroupMemberStatus.ACCEPTED, size: memberPageSize }))
        }
    }

    const renderActionButton = () => {
        const menu = (
            <Menu>
                {group?.isAdmin && <Menu.Item key="1">
                    <a href={`/groups/${group.id}/update`}>{t(translations.group.update_group)}</a>
                </Menu.Item>}
                <Menu.Item key="1">
                    <a href="/" onClick={showLeaveGroupModal}>{t(translations.group.leave_group)}</a>
                </Menu.Item>
                {group?.isAdmin &&
                    <Menu.Item key="2">
                        <a href="/" onClick={showDeleteGroupModal}>{t(translations.group.delete_group)}</a>
                    </Menu.Item>
                }
            </Menu>
        );

        return (
            <Dropdown overlay={menu} trigger={['click']}>
                <a href="/" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    {t(translations.group.manage)} <DownOutlined />
                </a>
            </Dropdown>
        );
    }

    const renderButtonByStatus = () => {
        let button = <></>;
        if (joinStatus === GroupMemberStatus.REQUESTED)
            button = <CreateButton onClick={undoJoin} shape="round" icon={<MdOutlineUndo style={{ marginRight: '10px', fontSize: '17px' }} />}>{t(translations.group.cancel)}</CreateButton>
        if (!joinStatus)
            button = <Button onClick={joinGroup} shape="round" icon={<MdOutlineGroupAdd style={{ marginRight: '10px', fontSize: '17px' }} />}>{t(translations.group.join)}</Button>

        return <div style={{ marginRight: '10px' }}>{button}</div>;
    }

    const goBack = () => {
        handleGoBack(history);
    }

    React.useEffect(() => {
        if (group.id) {
            setJoinStatus(group.status);
        }
    }, [group]);

    return (
        <>
            <DeleteGroupModal group={group} showModal={showDeleteModal} setShowModal={setShowDeleteModal} />
            <LeaveGroupModal group={group} showModal={showLeaveModal} setShowModal={setShowLeaveModal} />
            <Wrapper>
                <GobackButton onClick={goBack}>
                    <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                </GobackButton>
                <RightSectionWrapper>
                    <Spin style={{ marginRight: '15px' }} spinning={isLoading}>
                        {renderButtonByStatus()}
                    </Spin>
                    <InnerWrapper>
                        <NavItem className="active">{t(translations.group.members_nav)}</NavItem>
                        {group?.groupMemberId && group.status === GroupMemberStatus.ACCEPTED &&
                            <NavItem>{renderActionButton()}</NavItem>}
                    </InnerWrapper>
                </RightSectionWrapper>
            </Wrapper>
        </>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const InnerWrapper = styled.div`
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid #eee;
    padding: 5px;
    display: flex;
    flex-direction: row;
`;

const NavItem = styled.div`
    border-radius: 15px;
    padding: 10px 15px;
    margin: 0 10px;
    cursor: pointer;

    &.active {
        background: #fff;
        border: 1px solid #eee;
    }
`;

const RightSectionWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;