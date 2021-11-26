import React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';
import { GroupInvitationList } from './GroupInvitationList';
import { GroupRequestedList } from './GroupRequestedList';

export const RightPane = () => {
    return (
        <Wrapper>
            <GroupInvitationList/>
            <GroupRequestedList/>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    ${media.medium`
        width: 33%;
        display: block;
    `}

    display: none;
    padding-top: 30px;
`;