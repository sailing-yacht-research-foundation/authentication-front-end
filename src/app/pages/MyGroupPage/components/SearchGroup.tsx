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

export const SearchGroup = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const { actions } = useGroupSlice();

    const searchForGroups = (keyword) => {
        dispatch(actions.searchForGroups({ keyword, page: 1 }));
    }

    const [showModal, setShowModal] = React.useState<boolean>(false);

    const searchKeyword = useSelector(selectSearchKeyword);

    const setSearchKeyword = (e) => {
        const value = e.target?.value;
        dispatch(actions.setSearchKeyword(value));
        if (value) dispatch(actions.setSearchResults([]));
    }

    const invitationTotal = useSelector(selectInvitationTotalPage);

    return (
        <SearchBarWrapper>
            <InvitationModal reloadInvitationList={null} showModal={showModal} setShowModal={setShowModal} />
            {invitationTotal > 0 && <InvitationCount onClick={() => setShowModal(true)} color="success">
                {t(translations.group.number_of_invitations, { numberOfInvitations: invitationTotal })}
            </InvitationCount>}
            <StyledSearchBar value={searchKeyword} onChange={setSearchKeyword} onSearch={searchForGroups} placeholder={t(translations.group.search_groups)} />
        </SearchBarWrapper>
    );
}

const SearchBarWrapper = styled.div`
    text-align: right;
    padding: 10px 0;
    margin-top: 30px;
`;

const StyledSearchBar = styled(Input.Search)`
    width: 300px;
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