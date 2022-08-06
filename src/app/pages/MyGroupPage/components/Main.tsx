import React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';
import { GroupList } from './GroupList';
import { RightPane } from './RightPane';

export const Main = () => {
    return (
        <Wrapper>
            <RightPane />
            <GroupList />

        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;

    ${media.medium`
        flex-direction: row-reverse;
    `};

    flex-direction: column;
`;
