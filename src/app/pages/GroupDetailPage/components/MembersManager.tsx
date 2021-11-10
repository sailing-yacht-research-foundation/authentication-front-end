import React from 'react';
import styled from 'styled-components';
import { SectionContainer, SectionTitle, PaginationContainer, SectionTitleWrapper } from './Members';
import { Menu, Dropdown, Spin, Pagination } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { UserItemRow } from './UserItemRow';
import { assignAdmin } from 'services/live-data-server/groups';
import { useParams } from 'react-router';
import { CreateButton } from 'app/components/SyrfGeneral';
import { IoMdPersonAdd } from 'react-icons/io';
import { InviteUserModal } from './modals/InviteUserModal';
import { RemoveMemberFromGroupModal } from './modals/RemoveUserFromGroupModal';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { selectMembers, selecTotalMembers, selectMemberCurrentPage, selectAdminCurrentPage, selectIsGettingMembers } from '../slice/selectors';
import { useGroupDetailSlice } from '../slice';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { renderNumberWithCommas } from 'utils/helpers';

export const MembersManager = (props) => {

    const { t } = useTranslation();

    const { group } = props;

    const { groupId } = useParams<{ groupId: string }>();

    const [showModal, setShowModal] = React.useState<boolean>(false);

    const members = useSelector(selectMembers);

    const totalMembers = useSelector(selecTotalMembers);

    const adminCurrentPage = useSelector(selectAdminCurrentPage);

    const memberCurrentPage = useSelector(selectMemberCurrentPage);

    const dispatch = useDispatch();

    const { actions } = useGroupDetailSlice();

    const [member, setMember] = React.useState<any>({});

    const [showRemoveFromGroupModal, setShowRemoveFromGroupModal] = React.useState<boolean>(false);

    const isGettingMembers = useSelector(selectIsGettingMembers);

    const renderMembers = () => {
        if (members.length > 0)
            return members.map(item => <UserItemRow item={item} buttons={renderActionButton(item)} />);

        return <span>{t(translations.group.we_dont_have_any_members_right_now)}</span>
    }

    const getMembers = (page) => {
        dispatch(actions.getMembers({ page: page, groupId: groupId }))
    }

    const onPaginationChanged = (page) => {
        getMembers(page);
    }

    const removeFromGroup = (e, member) => {
        e.preventDefault();
        setMember(member);
        setShowRemoveFromGroupModal(true);
    }

    const onUsersInvited = () => {
        getMembers(memberCurrentPage);
    }

    const onMemberRemoved = () => {
        getMembers(memberCurrentPage);
    }

    const setMemberAsAdmin = async (e, member) => {
        e.preventDefault();
        const response = await assignAdmin(groupId, member.id);

        if (response.success) {
            getMembers(memberCurrentPage);
            dispatch(actions.getAdmins({ page: adminCurrentPage, groupId: groupId }))
            toast.success(t(translations.group.successfully_assign_this_member_as_admin));
        } else {
            if (response.error?.response?.status === 404) {
                toast.info(t(translations.group.this_member_has_not_accepted_the_invitation_to_join_group));
                return;
            }
            toast.error(t(translations.group.an_error_happened_when_performing_your_request));
        }
    }

    React.useEffect(() => {
        getMembers(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderActionButton = (member) => {
        if (!group.isAdmin) return <></>;

        const menu = (
            <Menu>
                <Menu.Item key="2">
                    <a onClick={(e) => setMemberAsAdmin(e, member)} href="/">Set as admin</a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a onClick={(e) => removeFromGroup(e, member)} href="/">Remove from group</a>
                </Menu.Item>
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

    return (
        <SectionContainer>
            <InviteUserModal onUsersInvited={onUsersInvited} groupId={groupId} showModal={showModal} setShowModal={setShowModal} />
            <RemoveMemberFromGroupModal groupId={groupId} onMemberRemoved={onMemberRemoved} member={member} showModal={showRemoveFromGroupModal} setShowModal={setShowRemoveFromGroupModal} />
            <SectionTitleWrapper>
                <SectionTitle>{t(translations.group.members, { membersCount: renderNumberWithCommas(totalMembers) })}</SectionTitle>
                {group?.isAdmin && <CreateButton onClick={() => setShowModal(true)} icon={<IoMdPersonAdd style={{ marginRight: '10px', fontSize: '17px' }} />}>Invite</CreateButton>}
            </SectionTitleWrapper>
            <Spin spinning={isGettingMembers}>
                <MemberList>
                    {renderMembers()}
                </MemberList>
                {
                    (totalMembers > 10) && <PaginationContainer>
                        <Pagination defaultCurrent={memberCurrentPage} current={memberCurrentPage} onChange={onPaginationChanged} total={totalMembers} />
                    </PaginationContainer>
                }
            </Spin>
        </SectionContainer>
    );
}

const MemberList = styled.div``;