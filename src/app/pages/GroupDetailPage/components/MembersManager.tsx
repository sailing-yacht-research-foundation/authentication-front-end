import React from 'react';
import styled from 'styled-components';
import { SectionContainer, SectionTitle, PaginationContainer, SectionTitleWrapper } from './Members';
import { Menu, Dropdown, Spin, Pagination } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { UserItemRow } from './UserItemRow';
import { assignAdmin, blockMember, unBlockMember } from 'services/live-data-server/groups';
import { useParams } from 'react-router';
import { CreateButton, FilterWrapper } from 'app/components/SyrfGeneral';
import { IoMdPersonAdd } from 'react-icons/io';
import { InviteUserModal } from './modals/InviteUserModal';
import { RemoveMemberFromGroupModal } from './modals/RemoveUserFromGroupModal';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { selectMembers, selecTotalMembers, selectMemberCurrentPage, selectAdminCurrentPage, selectIsGettingMembers, selectMemberPageSize, selectAdminPageSize } from '../slice/selectors';
import { useGroupDetailSlice } from '../slice';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { renderNumberWithCommas, showToastMessageOnRequestError } from 'utils/helpers';
import { DEFAULT_PAGE_SIZE, GroupMemberStatus } from 'utils/constants';
import { ConfirmModal } from 'app/components/ConfirmModal';

const filterModes = {
    REQUESTED: GroupMemberStatus.REQUESTED,
    DECLINED: GroupMemberStatus.DECLINED,
    INVITED: GroupMemberStatus.INVITED,
    BLOCKED: GroupMemberStatus.BLOCKED,
    ACCEPTED: GroupMemberStatus.ACCEPTED,
    ALL: ''
}

export const MembersManager = (props) => {

    const { t } = useTranslation();

    const { group } = props;

    const { groupId } = useParams<{ groupId: string }>();

    const [showModal, setShowModal] = React.useState<boolean>(false);

    const [showBlockConfirmModal, setShowBlockConfirmModal] = React.useState<boolean>(false);

    const members = useSelector(selectMembers);

    const totalMembers = useSelector(selecTotalMembers);

    const adminCurrentPage = useSelector(selectAdminCurrentPage);

    const memberCurrentPage = useSelector(selectMemberCurrentPage);

    const memberPageSize = useSelector(selectMemberPageSize);

    const adminPageSize = useSelector(selectAdminPageSize);

    const dispatch = useDispatch();

    const { actions } = useGroupDetailSlice();

    const [member, setMember] = React.useState<any>({});

    const [showRemoveFromGroupModal, setShowRemoveFromGroupModal] = React.useState<boolean>(false);

    const isGettingMembers = useSelector(selectIsGettingMembers);

    const [filterMode, setFilterMode] = React.useState<string>('');

    const filterOptions = [
        { title: t(translations.group.all), mode: '' },
        { title: t(translations.group.invited), mode: filterModes.INVITED },
        { title: t(translations.group.accepted), mode: filterModes.ACCEPTED },
        { title: t(translations.group.declined), mode: filterModes.DECLINED },
        { title: t(translations.group.blocked), mode: filterModes.BLOCKED }
    ];

    const renderMembers = () => {
        if (members.length > 0)
            return members.map((item, index) => <UserItemRow key={index} item={item} buttons={renderActionButton(item)} />);

        return <span>{t(translations.group.we_dont_have_any_members_right_now)}</span>
    }

    const getMembers = (page, size, status) => {
        dispatch(actions.getMembers({ page: page, groupId: groupId, status: status, size }))
    }

    const onPaginationChanged = (page, size) => {
        getMembers(page, size, filterMode);
    }

    const removeFromGroup = (e, member) => {
        e.preventDefault();
        setMember(member);
        setShowRemoveFromGroupModal(true);
    }

    const onUsersInvited = () => {
        getMembers(memberCurrentPage, memberPageSize, filterMode);
    }

    const onMemberRemoved = () => {
        getMembers(memberCurrentPage, memberPageSize, filterMode);
    }

    const setMemberAsAdmin = async (e, member) => {
        e.preventDefault();
        const response = await assignAdmin(groupId, member.id);

        if (response.success) {
            getMembers(memberCurrentPage, memberPageSize, filterMode);
            dispatch(actions.getAdmins({ page: adminCurrentPage, size: adminPageSize, groupId: groupId }))
            toast.success(t(translations.group.successfully_assign_this_member_as_admin));
        } else {
            if (response.error?.response?.status === 404) {
                toast.info(t(translations.group.this_member_has_not_accepted_the_invitation_to_join_group));
                return;
            }
            showToastMessageOnRequestError(response.error)
        }
    }

    const block = async (e) => {
        e.preventDefault();

        const response = await blockMember(groupId, member.member?.id);

        if (response.success) {
            toast.success(t(translations.group.successfully_blocked_member_out_of_the_group));
            getMembers(memberCurrentPage, memberPageSize, filterMode);
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowBlockConfirmModal(false);
    }

    const unblock = async (e, member) => {
        e.preventDefault();

        const response = await unBlockMember(groupId, member.member?.id);

        if (response.success) {
            toast.success(t(translations.group.successfully_unblocked_member_out_of_the_group));
            getMembers(memberCurrentPage, memberPageSize, filterMode);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const showBlockModal = (e, member) => {
        e.preventDefault();
        setMember(member);
        setShowBlockConfirmModal(true);
    }

    React.useEffect(() => {
        getMembers(1, 10, '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderActionButton = (member) => {
        if (!group.isAdmin) return <></>;

        const menu = (
            <Menu>
                {
                    GroupMemberStatus.ACCEPTED === member.status && <Menu.Item key="2">
                        <a onClick={(e) => setMemberAsAdmin(e, member)} href="/">{t(translations.group.set_as_admin)}</a>
                    </Menu.Item>
                }
                <Menu.Item key="1">
                    <a onClick={(e) => removeFromGroup(e, member)} href="/">{t(member.status === GroupMemberStatus.INVITED ? translations.group.cancel_invitation : translations.group.remove_from_group)}</a>
                </Menu.Item>
                {
                    member.status !== GroupMemberStatus.BLOCKED ? (<Menu.Item key="1">
                        <a onClick={(e) => showBlockModal(e, member)} href="/">{t(translations.general.block)}</a>
                    </Menu.Item>) : (<Menu.Item key="1">
                        <a onClick={(e) => unblock(e, member)} href="/">{t(translations.general.unblock)}</a>
                    </Menu.Item>)
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

    const filterMembers = (event, mode) => {
        event.preventDefault();
        let status = mode;
        if (status == filterModes.ALL) status = '';
        getMembers(1, DEFAULT_PAGE_SIZE, status);
        setFilterMode(status);
    }

    const menu = (
        <Menu>
            {filterOptions.map((item, index) => (<Menu.Item key={index}>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={e => filterMembers(e, item.mode)}>
                    {item.title}
                </a>
            </Menu.Item>))}
        </Menu>
    );

    return (
        <SectionContainer>
            <ConfirmModal content={t(translations.group.are_you_really_sure_you_want_to_block_user_they_will_no_longer, { memberName: member.member?.name })}
                title={t(translations.group.are_you_sure_you_want_to_block, { memberName: member.member?.name })}
                showModal={showBlockConfirmModal}
                onCancel={() => setShowBlockConfirmModal(false)}
                onOk={block} />
            <InviteUserModal onUsersInvited={onUsersInvited} groupId={groupId} showModal={showModal} setShowModal={setShowModal} />
            <RemoveMemberFromGroupModal groupId={groupId} onMemberRemoved={onMemberRemoved} member={member} showModal={showRemoveFromGroupModal} setShowModal={setShowRemoveFromGroupModal} />
            <SectionTitleWrapper>
                <SectionTitle>{t(translations.group.members, { membersCount: renderNumberWithCommas(totalMembers) })}</SectionTitle>
                {group.isAdmin && <CreateButton onClick={() => setShowModal(true)} icon={<IoMdPersonAdd style={{ marginRight: '10px', fontSize: '17px' }} />}>Invite</CreateButton>}
            </SectionTitleWrapper>
            {group.isAdmin && <FilterWrapper>
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                        {filterMode === '' ? t(translations.group.all) : filterMode.toLowerCase()} <DownOutlined />
                    </a>
                </Dropdown>
            </FilterWrapper>}
            <Spin spinning={isGettingMembers}>
                <MemberList>
                    {renderMembers()}
                </MemberList>
                {
                    (totalMembers > DEFAULT_PAGE_SIZE) && <PaginationContainer>
                        <Pagination defaultCurrent={memberCurrentPage} current={memberCurrentPage} onChange={onPaginationChanged} total={totalMembers} />
                    </PaginationContainer>
                }
            </Spin>
        </SectionContainer>
    );
}

const MemberList = styled.div``;