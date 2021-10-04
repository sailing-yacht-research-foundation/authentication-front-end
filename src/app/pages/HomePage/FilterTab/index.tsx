import React from 'react';
import styled from 'styled-components';
import { media } from 'styles/media';
import { FilterResult } from './components/FilterResult';
import { BsSearch } from 'react-icons/bs';
import { StyleConstants } from 'styles/StyleConstants';

export const FilterTab = (props) => {
    const { onPaginationPageChanged } = props; 

    return (
        <Wrapper>
            <FilterResult onPaginationPageChanged={onPaginationPageChanged} />
            <ToggleFilterPane>
                <BsSearch size={25} color={StyleConstants.MAIN_TONE_COLOR} />
            </ToggleFilterPane>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;

    ${media.medium`
        height: 80vh;
    `}
`;

const ToggleFilterPane = styled.div`
    position: fixed;
    bottom: 10%;
    right: 20px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 8px;
    box-shadow: 0 3px 8px rgba(9, 32, 77, 0.12), 0 0 2px rgba(29, 17, 51, 0.12);
    cursor: pointer;

    ${media.medium`
        display: none;
    `}
`;