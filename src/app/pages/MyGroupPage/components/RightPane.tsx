import React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';
import { GroupInvitationList } from './GroupInvitationList';
import { GroupRequestedList } from './GroupRequestedList';

export const RightPane = () => {
    return (
        <Wrapper className='caidmmm'>
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

    display: block;
    padding-top: 30px;
`;
