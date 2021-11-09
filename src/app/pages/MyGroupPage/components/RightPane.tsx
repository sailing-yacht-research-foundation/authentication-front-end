import React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';
import { GroupInvitationList } from './GroupInvitationList';

export const RightPane = () => {
    return (
        <Wrapper>
            <GroupInvitationList/>
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