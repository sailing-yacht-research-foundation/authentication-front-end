import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { selectSearchKeyword } from '../slice/selectors';
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