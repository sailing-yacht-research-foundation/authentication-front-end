import React from 'react';
import { Input, Tag } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useGroupSlice } from '../slice';
import { selectInvitationTotalPage, selectSearchKeyword } from '../slice/selectors';
import { InvitationModal } from './InvitationModal';
import { media } from 'styles/media';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { GroupSearchAutoComplete } from './GroupSearchAutoComplete';

export const SearchGroup = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { actions } = useGroupSlice();

    const searchForGroups = (keyword) => {
        if (keyword.length === 0) return;
        dispatch(actions.searchForGroups({ keyword, page: 1 }));
        setShowSuggestions(false);
    }

    const [showModal, setShowModal] = React.useState<boolean>(false);

    const [showSuggestions, setShowSuggestions] = React.useState<boolean>(false);

    const searchKeyword = useSelector(selectSearchKeyword);

    const setSearchKeyword = (e) => {
        const value = e.target?.value;
        dispatch(actions.setSearchKeyword(value));
        dispatch(actions.setPerformedSearch(false));
        if (value.length === 0) {
            dispatch(actions.setSearchResults([]));
        } else {
            setShowSuggestions(true);
        }
    }

    const invitationTotal = useSelector(selectInvitationTotalPage);

    return (
        <SearchBarWrapper>
            <InvitationModal reloadParentList={null} showModal={showModal} setShowModal={setShowModal} />
            {invitationTotal > 0 && <InvitationCount onClick={() => setShowModal(true)} color="success">
                {t(translations.group.number_of_invitations, { numberOfInvitations: invitationTotal })}
            </InvitationCount>}
            <GroupSearchBarWrapper>
                <StyledSearchBar allowClear={true} value={searchKeyword} onChange={setSearchKeyword} onSearch={searchForGroups} placeholder={t(translations.group.search_groups)} />
                <GroupSearchAutoComplete showSuggestions={showSuggestions} setShowSuggestions={setShowSuggestions} keyword={searchKeyword} />
            </GroupSearchBarWrapper>
        </SearchBarWrapper>
    );
}

const SearchBarWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
    margin-top: 30px;
`;

const StyledSearchBar = styled(Input.Search)`

    border-radius: 5px;
`;

const InvitationCount = styled(Tag)`
    margin-right: 0;
    margin-bottom: 10px;
    cursor: pointer;
    visibility: visible;

    ${media.medium`
        visibility: hidden;
    `}
`;

const GroupSearchBarWrapper = styled.div`
    position: relative;
    width: 300px;
`;