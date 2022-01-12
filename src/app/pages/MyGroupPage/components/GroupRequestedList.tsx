import React from 'react';
import styled from 'styled-components';
import { Pagination, Spin } from 'antd';
import { media } from 'styles/media';
import { translations } from 'locales/translations';
import { useDispatch, useSelector } from 'react-redux';
import { selectRequestedGroups, selectRequestedGroupTotalPage, selectRequestedGroupCurrentPage, selectIsGettingRequestedGroups } from '../slice/selectors';
import { useTranslation } from 'react-i18next';
import { GroupRequestedItemRow } from './GroupRequestedItemRow';
import { useGroupSlice } from '../slice';
import { PaginationContainer } from 'app/pages/GroupDetailPage/components/Members';

export const GroupRequestedList = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const groupRequestedTotalPage = useSelector(selectRequestedGroupTotalPage);

    const groupRequestedCurrentPage = useSelector(selectRequestedGroupCurrentPage);

    const isGettingRequestedGroups = useSelector(selectIsGettingRequestedGroups)

    const requestedGroups = useSelector(selectRequestedGroups);

    const { actions } = useGroupSlice();

    const getRequestedGroups = async (page) => {
        dispatch(actions.getRequestedGroups(page));
    }

    const renderInvitationItem = () => {
        if (requestedGroups.length > 0)
            return requestedGroups.map(request => <GroupRequestedItemRow key={request.id} request={request} />);
        return <EmptyInvitationMessage>{t(translations.group.you_have_not_requested_to_join_any_groups)}</EmptyInvitationMessage>
    }

    const onPaginationChanged = (page) => {
        getRequestedGroups(page);
    }

    React.useEffect(() => {
        getRequestedGroups(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            <TitleContainer>
                <Title>{t(translations.group.requested)}</Title>
            </TitleContainer>
            <Spin spinning={isGettingRequestedGroups}>
                <InvitationList>
                    {renderInvitationItem()}
                </InvitationList>
                {
                    groupRequestedTotalPage > 10 && <PaginationContainer>
                        <Pagination onChange={onPaginationChanged} defaultCurrent={groupRequestedCurrentPage} current={groupRequestedCurrentPage} total={groupRequestedTotalPage} />
                    </PaginationContainer>
                }
            </Spin>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    border-radius: 5px;
    padding: 15px;
    background: #fff;
    width: 100%;
    border: 1px solid #eee;
    display: none;
    margin-top: 10px;

    ${media.medium`
        display: block;
    `}
`;

const Title = styled.h3``;

const InvitationList = styled.div``;

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const EmptyInvitationMessage = styled.span``;