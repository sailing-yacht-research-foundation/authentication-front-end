import React from 'react';
import styled from 'styled-components';
import { GroupInvitationList } from './GroupInvitationList';

export const RightPane = () => {
    return (
        <Wrapper>
            <GroupInvitationList/>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 33%;
    padding-top: 30px;
`;