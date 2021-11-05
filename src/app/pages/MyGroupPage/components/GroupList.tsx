import React from 'react';
import styled from 'styled-components';
import { SearchGroup } from './SearchGroup';
import { Spin, Pagination } from 'antd';
import { CreateButton } from 'app/components/SyrfGeneral';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectGroupCurrentPage,
    selectGroups,
    selectGroupTotalPage,
    selectIsLoading,
    selectSearchKeyword,
    selectSearchResults,
    selectSearchCurrentPage,
    selectSearchTotalPage
} from '../slice/selectors';
import { GroupItemRow } from './GroupItem';
import { useGroupSlice } from '../slice';

export const GroupList = () => {

    const groups = useSelector(selectGroups);

    const history = useHistory();

    const dispatch = useDispatch();

    const { actions } = useGroupSlice();

    const currentPage = useSelector(selectGroupCurrentPage);

    const totalPage = useSelector(selectGroupTotalPage);

    const isLoading = useSelector(selectIsLoading);

    const results = useSelector(selectSearchResults);

    const searchCurrentPage = useSelector(selectSearchCurrentPage);

    const searchTotalPage = useSelector(selectSearchTotalPage);

    const searchKeyword = useSelector(selectSearchKeyword);

    const renderGroupItems = () => {
        if (groups.length > 0)
            return groups.map(group => <GroupItemRow group={group?.group} />);
        return <span>Your groups will be shown here.</span>
    }

    const renderGroupResults = () => {
        if (results.length > 0)
            return results.map(group => <GroupItemRow group={group} />);
        return <span>Your results will be shown here.</span>
    }

    const onPaginationChanged = (page) => {
        dispatch(actions.getGroups(page));
    }

    const onSearchPaginationChanged = (page) => {
        dispatch(actions.searchForGroups({ keyword: searchKeyword, page: page }));
    }

    React.useEffect(() => {
        dispatch(actions.getGroups(1));
    }, []);

    return (
        <Wrapper>
            <SearchGroup />
            {
                results.length === 0 ? (
                    <>
                        <GroupListContainer>
                            <h3>My Groups</h3>
                            <CreateButton onClick={() => {
                                history.push('/groups/create');
                            }} icon={<AiFillPlusCircle
                                style={{ marginRight: '5px' }}
                                size={18} />}>Create a new Group</CreateButton>
                        </GroupListContainer>
                        <Spin spinning={isLoading}>
                            {renderGroupItems()}
                            <PaginationWrapper>
                                <Pagination onChange={onPaginationChanged} current={currentPage} total={totalPage} />
                            </PaginationWrapper>
                        </Spin>
                    </>
                ) : (
                    <>
                        <GroupListContainer>
                            <h3>Results</h3>
                        </GroupListContainer>
                        <Spin spinning={isLoading}>
                            {renderGroupResults()}
                            <PaginationWrapper>
                                <Pagination onChange={onSearchPaginationChanged} current={searchCurrentPage} total={searchTotalPage} />
                            </PaginationWrapper>
                        </Spin>
                    </>
                )
            }
        </Wrapper>
    );
}

const Wrapper = styled.div`
    width: 65%;
    padding: 0 20px;
`;

const PaginationWrapper = styled.div`
    margin: 15px 0;
    text-align: right;
`;

const GroupListContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
`;