import React from 'react';
import styled from 'styled-components';
import { Button, Spin } from 'antd';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { useHistory } from 'react-router';
import { requestJoinGroup } from 'services/live-data-server/groups';
import { toast } from 'react-toastify';
import { renderNumberWithCommas } from 'utils/helpers';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { GroupMemberStatus } from 'utils/constants';

export const GroupItemRow = (props) => {

    const { t } = useTranslation();

    const history = useHistory();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { group, showGroupButton, memberCount, status, onGroupJoinRequested } = props;

    const renderButtonByStatus = () => {
        if (!showGroupButton) return <></>;

        if (status === GroupMemberStatus.requested)
            return <Button onClick={e => e.preventDefault()} shape="round" icon={<MdOutlineGroupAdd style={{ marginRight: '10px', fontSize: '17px' }} />}>{t(translations.group.pending)}</Button>
        if (!status)
            return <Button onClick={joinGroup} shape="round" icon={<MdOutlineGroupAdd style={{ marginRight: '10px', fontSize: '17px' }} />}>{t(translations.group.join)}</Button>
    }

    const renderGroupText = (text) => {
        const type = String(text).toLowerCase();
        return type.charAt(0).toUpperCase() + type.slice(1);
    }

    const showGroupItemDetail = () => {
        history.push(`/groups/${group.id}`);
    }

    const joinGroup = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        const response = await requestJoinGroup(group.id);
        setIsLoading(false);

        if (response.success) {
            if (onGroupJoinRequested) onGroupJoinRequested();
        } else {
            toast.error(t(translations.group.an_error_happened_joining_this_group));
        }
    }

    return (
        <GroupItem onClick={showGroupItemDetail}>
            <GroupItemAvatarContainer>
                <GroupItemAvatar style={{ background: "url('/default-avatar.jpeg')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} />
            </GroupItemAvatarContainer>
            <GroupItemInfoContainer>
                <GroupItemTitle>{group.groupName}</GroupItemTitle>
                <GroupItemDescription>{group.description}</GroupItemDescription>
                <GroupType>{renderGroupText(group.groupType)} • {renderGroupText(group.visibility)} • {t(translations.group.number_of_members, { numberOfMembers: renderNumberWithCommas(memberCount) })}</GroupType>
            </GroupItemInfoContainer>
            <GroupItemAction>
                <Spin spinning={isLoading}>
                    {renderButtonByStatus()}
                </Spin>
            </GroupItemAction>
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
`;

const GroupItemAvatar = styled.div`
    width: 55px;
    height: 55px;
    border-radius: 50%;
`