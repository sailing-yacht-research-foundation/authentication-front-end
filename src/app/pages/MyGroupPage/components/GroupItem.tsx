import React from 'react';
import styled from 'styled-components';
import { Space, Button, Spin } from 'antd';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { useHistory } from 'react-router';
import { requestJoinGroup } from 'services/live-data-server/groups';
import { toast } from 'react-toastify';

const enum GroupMemberStatus {
    invited = 'INVITED',
    requested = 'REQUESTED',
    accepted = 'ACCEPTED',
    declined = 'DECLINED'
};

export const GroupItemRow = (props) => {

    const history = useHistory();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { group } = props;

    const renderButtonByStatus = () => {
        if (group.status === GroupMemberStatus.requested)
            return <Button shape="round" icon={<MdOutlineGroupAdd style={{ marginRight: '10px', fontSize: '17px' }} />}>Pending</Button>
        if (!group.status)
            return <Button onClick={joinGroup} shape="round" icon={<MdOutlineGroupAdd style={{ marginRight: '10px', fontSize: '17px' }} />}>Join</Button>
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

        } else {
            toast.error('An error happened when joining this group.');
        }
    }

    return (
        <GroupItem onClick={showGroupItemDetail}>
            <GroupItemInfoContainer>
                <GroupItemTitle>{group.groupName}</GroupItemTitle>
                <GroupItemDescription>{group.description}</GroupItemDescription>
                <GroupType>{renderGroupText(group.groupType)} • {renderGroupText(group.visibility)} • 18 members.</GroupType>
                <GroupMemberContainer>
                    <Space size={10}>
                        <GroupMemberItem style={{ background: "url('https://cdn.dribbble.com/users/439063/avatars/small/4f4177a2f6c0cc8e75dde4ff6b3705ae.png?1634834389')", backgroundSize: 'cover' }}>
                        </GroupMemberItem>
                        <GroupMemberItem style={{ background: "url('https://cdn.dribbble.com/users/439063/avatars/small/4f4177a2f6c0cc8e75dde4ff6b3705ae.png?1634834389')", backgroundSize: 'cover' }}>
                        </GroupMemberItem>
                        <GroupMemberItem style={{ background: "url('https://cdn.dribbble.com/users/439063/avatars/small/4f4177a2f6c0cc8e75dde4ff6b3705ae.png?1634834389')", backgroundSize: 'cover' }}>
                        </GroupMemberItem>
                        <GroupMemberItem>
                            5+
                        </GroupMemberItem>
                    </Space>
                </GroupMemberContainer>
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

const GroupMemberContainer = styled.div`
    display: flex;
    margin-top: 10px;
`;

const GroupType = styled.div`
    padding: 10px 0;
`;

const GroupMemberItem = styled.div`
    cursor: pointer;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: 1px solid #eee;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const GroupItemInfoContainer = styled.div`
    width: 100%;
`;

const GroupItemAction = styled.div`
    padding: 0 15px;
`;