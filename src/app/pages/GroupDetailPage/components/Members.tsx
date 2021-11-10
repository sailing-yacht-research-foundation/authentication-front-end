
import React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';
import { AdminsManager } from './AdminsManager';
import { MembersManager } from './MembersManager';
import { PendingJoinRequests } from './PendingJoinRequests';

export const Members = (props) => {

    const { group } = props;

    return (
        <Wrapper>
            {group.groupMemberId && group.isAdmin && <PendingJoinRequests group={group} />}
            <AdminsManager group={group} />
            <MembersManager group={group} />
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin-top: 15px;
    width: 100%;

    ${media.medium`
        width: 75%;
        margin-left: 15px;
    `}
`;

export const SectionContainer = styled.div`
    border: 1px solid #eee;
    border-radius: 10px;
    background: #fff;
    padding: 15px;

    &:not(:last-child) {
        margin-bottom: 15px;
    }
`;

export const SectionTitle = styled.h3`
    padding: 10px 0;
`;

export const SectionTitleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const PaginationContainer = styled.div`
    text-align: right;

    margin: 25px 0;
`;