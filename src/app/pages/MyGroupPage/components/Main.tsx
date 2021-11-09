import React from 'react';
import styled from 'styled-components';
import { GroupList } from './GroupList';
import { RightPane } from './RightPane';

export const Main = () => {
    return (
        <Wrapper>
            <GroupList />
            <RightPane />
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
`;