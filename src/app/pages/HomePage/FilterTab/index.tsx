import React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';
import { FilterResult } from './components/FilterResult';

export const FilterTab = (props) => {
    const { onPaginationPageChanged } = props; 

    return (
        <Wrapper>
            <FilterResult onPaginationPageChanged={onPaginationPageChanged} />
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;

    ${media.medium`
        height: 80vh;
    `}
`;