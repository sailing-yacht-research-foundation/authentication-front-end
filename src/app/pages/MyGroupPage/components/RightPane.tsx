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
        padding: 30px 0 0 0;
    `}
    padding: 30px 10px 0px 10px;
`;
