import { Wrapper } from 'app/components/SyrfGeneral';
import React from 'react';
import styled from 'styled-components';
import { Main } from './components/Main';

export const GroupDetailPage = () => {
    return (
        <StyledWrapper>
            <Main/>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
    margin-top: 73px;
    background: rgb(247, 247, 249) none repeat scroll 0% 0%;
    min-height: calc(100vh - 73px);
`;
