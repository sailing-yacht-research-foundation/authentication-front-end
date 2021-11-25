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
import { media } from 'styles/media';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

export const GroupList = () => {

    const { t } = useTranslation();

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

    const groupCurrentPage = useSelector(selectGroupCurrentPage);

    const renderGroupItems = () => {
        if (groups.length > 0)
            return groups.map(group => <GroupItemRow
                showGroupButton={false}
                memberCount={group.memberCount}
                group={group?.group}
                isAdmin={group?.isAdmin}
                status={group.status} />);
        return <span>{t(translations.group.your_groups_will_be_shown_here)}</span>
    }

    const renderGroupResults = () => {
        if (results.length > 0)
            return results.map(group => <GroupItemRow
                memberCount={group.memberCount}
                status={group.userStatus}
                showGroupButton={true}
                isAdmin={group?.isAdmin}
                onGroupJoinRequested={onGroupJoinRequested}
                group={group} />);
        return <span>{t(translations.group.your_results_will_be_shown_here)}</span>
    }

    const onPaginationChanged = (page) => {
        dispatch(actions.getGroups(page));
    }

    const onSearchPaginationChanged = (page) => {
        dispatch(actions.searchForGroups({ keyword: searchKeyword, page: page }));
    }

    const onGroupJoinRequested = () => {
        dispatch(actions.searchForGroups({ keyword: searchKeyword, page: searchCurrentPage }));
        dispatch(actions.getGroups(groupCurrentPage));
    }

    React.useEffect(() => {
        dispatch(actions.getGroups(groupCurrentPage));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            <SearchGroup />
            {
                results.length === 0 ? (
                    <>
                        <GroupListContainer>
                            <h3>{t(translations.group.my_groups)}</h3>
                            <CreateButton onClick={() => {
                                history.push('/groups/create');
                            }} icon={<AiFillPlusCircle
                                style={{ marginRight: '5px' }}
                                size={18} />}>{t(translations.group.create_a_new_group)}</CreateButton>
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
                            <h3>{t(translations.group.results)}</h3>
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
    width: 100%;
    padding: 0 10px;

    ${media.medium`
        width: 65%;
        padding: 0 20px;
    `}
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