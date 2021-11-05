import * as React from 'react';
import { Main } from './components/Main';
import styled from 'styled-components';

export function MyGroupsPage() {
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
