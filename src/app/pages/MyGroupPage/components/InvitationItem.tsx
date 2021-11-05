import React from 'react';
import styled from 'styled-components';
import { Space, Button } from 'antd';

export const InvitationItemRow = (props) => {
    const { invitation } = props;

    return (
        <InvitationItem>
            <ItemInfoContainer>
                <InvitationItemTitle>SYRF Race Team</InvitationItemTitle>
                <InvitationItemGroupMembersCount>Organization, 255 members</InvitationItemGroupMembersCount>
                <InvitationItemInvitedOn>22 Jul 2021</InvitationItemInvitedOn>
            </ItemInfoContainer>
            <ItemButtonContainer>
                <Space size={5}>
                    <Button type="primary">Join</Button>
                    <Button>Cancel</Button>
                </Space>
            </ItemButtonContainer>
        </InvitationItem>
    )
}

const InvitationItem = styled.div`
    padding: 15px 5px;
    display: flex;
    flex-direction: row;
    align-items: center;

    &:not(:last-child) {
        border-bottom: 1px solid #eee;
    }
`;

const InvitationItemTitle = styled.a``;

const InvitationItemGroupMembersCount = styled.span`
    margin-top: 5px;
`;

const InvitationItemInvitedOn = styled.span`
    margin-top: 5px;
    color: hsl(210, 8%, 45%);
`;

const ItemInfoContainer = styled.div`
    width: 60%;
    display: flex;
    flex-direction: column;

`;

const ItemButtonContainer = styled.div`
    text-align: right;
    display: block;
    width: 40%;
`;