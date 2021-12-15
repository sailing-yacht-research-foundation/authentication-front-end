import React from 'react';
import styled from 'styled-components';
import { Button, Spin, Tag, Space } from 'antd';
import { MdOutlineGroupAdd, MdOutlineUndo } from 'react-icons/md';
import { useHistory } from 'react-router';
import { leaveGroup, requestJoinGroup } from 'services/live-data-server/groups';
import { toast } from 'react-toastify';
import { renderNumberWithCommas, uppercaseFirstCharacter } from 'utils/helpers';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { DEFAULT_GROUP_AVATAR, GroupMemberStatus } from 'utils/constants';
import { VisibilityOfGroup } from './VisibilityOfGroup';
import { useDispatch, useSelector } from 'react-redux';
import { useGroupSlice } from '../slice';
import { selectGroupCurrentPage, selectRequestedGroupCurrentPage } from '../slice/selectors';
import { renderAvatar } from 'utils/user-utils';
import ReactTooltip from 'react-tooltip';

export const GroupItemRow = (props) => {

    const { t } = useTranslation();

    const history = useHistory();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const dispatch = useDispatch();

    const { actions } = useGroupSlice();

    const { group, showGroupButton, memberCount, status, onGroupJoinRequested, isAdmin, members } = props;

    const requestedGroupsCurrentPage = useSelector(selectRequestedGroupCurrentPage);

    const groupCurrentPage = useSelector(selectGroupCurrentPage);

    const renderButtonByStatus = () => {
        if (!showGroupButton) return <></>;

        if (status === GroupMemberStatus.REQUESTED)
            return <Button onClick={undoJoin} shape="round" icon={<MdOutlineUndo style={{ marginRight: '10px', fontSize: '17px' }} />}>{t(translations.group.cancel)}</Button>
        if (!status)
            return <Button onClick={joinGroup} shape="round" icon={<MdOutlineGroupAdd style={{ marginRight: '10px', fontSize: '17px' }} />}>{t(translations.group.join)}</Button>
    }

    const showGroupItemDetail = () => {
        history.push(`/groups/${group.id}`);
    }

    const handlePostJoinActions = (response) => {
        if (response.success) {
            if (onGroupJoinRequested) onGroupJoinRequested();
            dispatch(actions.getRequestedGroups(requestedGroupsCurrentPage));
            dispatch(actions.getGroups(groupCurrentPage));
        } else {
            toast.error(t(translations.group.an_error_happened_when_performing_your_request));
        }
    }

    const undoJoin = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        const response = await leaveGroup(group.id);
        setIsLoading(false);

        handlePostJoinActions(response);
    }

    const joinGroup = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        const response = await requestJoinGroup(group.id);
        setIsLoading(false);

        handlePostJoinActions(response);
    }

    const renderGroupMembers = () => {
        if (members && Array.isArray(members)) {
            return (<>
                {members.map(member =>
                    <GroupMemberItem data-tip={member.name}>
                        <img src={renderAvatar(member.avatar)} alt={member.name} />
                    </GroupMemberItem>
                )}
            </>)
        }

        return <></>;
    }

    return (
        <GroupItem onClick={showGroupItemDetail}>
            <GroupItemAvatarContainer>
                <img src={group.groupImage || DEFAULT_GROUP_AVATAR} alt={group.groupName} />
            </GroupItemAvatarContainer>
            <GroupItemInfoContainer>
                <GroupItemTitle>{group.groupName}</GroupItemTitle>
                <GroupItemDescription>{group.description}</GroupItemDescription>
                <GroupType>{group.groupType && uppercaseFirstCharacter(group.groupType) + ' • '} <VisibilityOfGroup visibility={group.visibility} /> • {t(translations.group.number_of_members, { numberOfMembers: renderNumberWithCommas(memberCount) })}</GroupType>
                <GroupMemberContainer>
                    <Space size={7}>
                        {renderGroupMembers()}
                    </Space>
                </GroupMemberContainer>
                {isAdmin && <Tag color="magenta">Admin</Tag>}
            </GroupItemInfoContainer>
            <GroupItemAction>
                <Spin spinning={isLoading}>
                    {renderButtonByStatus()}
                </Spin>
            </GroupItemAction>
            <ReactTooltip/>
        </GroupItem>
    )
}

const GroupItem = styled.div`
    width: 100%;
    background #fff;
    border: 1px solid #eee;
    border-radius: 5px;
    padding: 15px;
    display: flex;
    align-items: center;

    &:not(:last-child) {
        margin-bottom: 15px;
    }

    :hover {
        cursor: pointer;
    }
`;

const GroupItemTitle = styled.h3``;

const GroupItemDescription = styled.span`
    color: hsl(210, 8%, 45%);
`;

const GroupType = styled.div`
    padding: 10px 0;
`;

const GroupItemInfoContainer = styled.div`
    width: 100%;
`;

const GroupItemAction = styled.div`
    padding: 0 15px;
`;

const GroupItemAvatarContainer = styled.div`
    margin-right: 10px;
    flex: 0 0 auto;
    width: 55px;
    height: 55px;

    img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 1px solid #eee;
    }
`;

const GroupMemberItem = styled.div`
    cursor: pointer;
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        border-radius: 50%;
        border: 1px solid #eee;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

const GroupMemberContainer = styled.div`
    display: flex;
    margin: 7px 0;
`;