import React from 'react';
import { Input } from 'antd';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useGroupSlice } from '../slice';

export const SearchGroup = () => {

    const dispatch = useDispatch();

    const { actions } = useGroupSlice();

    const searchForGroups = (keyword) => {
        dispatch(actions.searchForGroups({ keyword, page: 1 }));
    }

    const setSearchKeyword = (e) => {
       if (e.target?.value?.length === 0) dispatch(actions.setSearchResults([]));
    }

    return (
        <SearchBarWrapper>
            <StyledSearchBar onChange={setSearchKeyword} onSearch={searchForGroups} placeholder={'Search public groups...'} />
        </SearchBarWrapper>
    );
}

const SearchBarWrapper = styled.div`
    text-align: right;
    padding: 10px 0;
`;

const StyledSearchBar = styled(Input.Search)`
    margin-top: 30px;
    width: 300px;
    border-radius: 5px;
`;