import React from 'react';
import styled from 'styled-components';
import { SectionContainer, SectionTitle, PaginationContainer, SectionTitleWrapper } from './Members';
import { Menu, Dropdown, Spin, Pagination } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { UserItemRow } from './UserItemRow';
import { useParams } from 'react-router';
import { CreateButton } from 'app/components/SyrfGeneral';
import { RiAdminFill } from 'react-icons/ri';
import { RemoveMemberFromGroupModal } from './modals/RemoveUserFromGroupModal';
import { RemoveAsAdminModal } from './modals/RemoveAsAdminModal';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAdminCurrentPage,
    selectAdmins,
    selectIsGettingAdmins,
    selectMemberCurrentPage,
    selectTotalAdmins,
    selectAdminPageSize,
    selectMemberPageSize
} from '../slice/selectors';
import { useGroupDetailSlice } from '../slice';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { DEFAULT_PAGE_SIZE } from 'utils/constants';
import { InviteUserModal } from './modals/InviteUserModal';

export const AdminsManager = (props) => {

    const { t } = useTranslation();

    const { group } = props;

    const { groupId } = useParams<{ groupId: string }>();

    const [showAssignModal, setShowAssignModal] = React.useState<boolean>(false);

    const [member, setMember] = React.useState<any>({});

    const [showRemoveFromGroupModal, setShowRemoveFromGroupModal] = React.useState<boolean>(false);

    const [showRemoveAsAdminModal, setShowRemoveAsAdminModal] = React.useState<boolean>(false);

    const admins = useSelector(selectAdmins);

    const totalAdmins = useSelector(selectTotalAdmins);

    const adminCurrentPage = useSelector(selectAdminCurrentPage);

    const memberCurrentPage = useSelector(selectMemberCurrentPage);

    const adminPageSize = useSelector(selectAdminPageSize);

    const memberPageSize = useSelector(selectMemberPageSize);

    const isGettingAdmins = useSelector(selectIsGettingAdmins);

    const dispatch = useDispatch();

    const { actions } = useGroupDetailSlice();

    const renderMembers = () => {
        if (admins.length > 0)
            return admins.map((item, index) => <UserItemRow key={index} item={item} buttons={renderActionButton(item)} />);

        return <span>{t(translations.group.we_dont_have_any_admins_right_now)}</span>
    }

    const onMemberRemoved = () => {
        getAdmins(adminCurrentPage, adminPageSize);
    }

    const getAdmins = (page, size) => {
        dispatch(actions.getAdmins({ groupId, page, size }));
    }

    const onPaginationChanged = (page, size) => {
        getAdmins(page, size);
    }

    const onAdminAdded = () => {
        getAdmins(adminCurrentPage, adminPageSize);
    }

    const removeFromGroup = (e, member) => {
        e.preventDefault();
        setShowRemoveFromGroupModal(true);
        setMember(member);
    }

    const showRemoveMemberAsAdminModal = (e, member) => {
        e.preventDefault();
        setMember(member);
        setShowRemoveAsAdminModal(true);
    }

    const onAdminRemoved = () => {
        dispatch(actions.getMembers({ groupId: groupId, page: memberCurrentPage, size: memberPageSize }));
        dispatch(actions.getAdmins({ groupId: groupId, page: adminCurrentPage, size: adminPageSize }));
    }

    React.useEffect(() => {
        getAdmins(1, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderActionButton = (member) => {
        if (group?.groupMemberId === member.id || !group.isAdmin) return <></>;

        const menu = (
            <Menu>
                <Menu.Item key="1">
                    <a href="/" onClick={(e) => showRemoveMemberAsAdminModal(e, member)}>{t(translations.group.remove_as_admin)}</a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a href="/" onClick={(e) => removeFromGroup(e, member)}>{t(translations.group.remove_from_group)}</a>
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
            <RemoveAsAdminModal groupId={groupId} member={member} onAdminRemoved={onAdminRemoved} showModal={showRemoveAsAdminModal} setShowModal={setShowRemoveAsAdminModal} />
            <InviteUserModal onUsersInvited={onAdminAdded} groupId={groupId} showModal={showAssignModal} setShowModal={setShowAssignModal} isAdmin={true} />
            <RemoveMemberFromGroupModal groupId={groupId} onMemberRemoved={onMemberRemoved} member={member} showModal={showRemoveFromGroupModal} setShowModal={setShowRemoveFromGroupModal} />
            <SectionTitleWrapper>
                <SectionTitle>{t(translations.group.admins, { adminsCount: totalAdmins })}</SectionTitle>
                {group?.isAdmin && <CreateButton onClick={() => setShowAssignModal(true)} icon={<RiAdminFill style={{ marginRight: '10px' }} />}>{t(translations.group.add_admins)}</CreateButton>}
            </SectionTitleWrapper>
            <Spin spinning={isGettingAdmins}>
                <MemberList>
                    {renderMembers()}
                </MemberList>
                {
                    (totalAdmins > DEFAULT_PAGE_SIZE) && <PaginationContainer>
                        <Pagination pageSize={adminPageSize} defaultCurrent={adminCurrentPage} current={adminCurrentPage} onChange={onPaginationChanged} total={totalAdmins} />
                    </PaginationContainer>
                }
            </Spin>
        </SectionContainer>
    );
}

const MemberList = styled.div``;
