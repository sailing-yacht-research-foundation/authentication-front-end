import React from 'react';
import styled from 'styled-components';
import { Pagination, Spin } from 'antd';
import { media } from 'styles/media';
import { translations } from 'locales/translations';
import { useDispatch, useSelector } from 'react-redux';
import { selectRequestedGroups, selectRequestedGroupTotalPage, selectRequestedGroupCurrentPage, selectIsGettingRequestedGroups, selectRequestedGroupPageSize } from '../slice/selectors';
import { useTranslation } from 'react-i18next';
import { GroupRequestedItemRow } from './GroupRequestedItemRow';
import { useGroupSlice } from '../slice';
import { PaginationContainer } from 'app/pages/GroupDetailPage/components/Members';
import { DEFAULT_PAGE_SIZE } from 'utils/constants';

export const GroupRequestedList = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const groupRequestedTotalPage = useSelector(selectRequestedGroupTotalPage);

    const groupRequestedCurrentPage = useSelector(selectRequestedGroupCurrentPage);

    const groupRequestedPageSize = useSelector(selectRequestedGroupPageSize);

    const isGettingRequestedGroups = useSelector(selectIsGettingRequestedGroups)

    const requestedGroups = useSelector(selectRequestedGroups);

    const { actions } = useGroupSlice();

    const getRequestedGroups = async (page, size) => {
        dispatch(actions.getRequestedGroups({ page, size }));
    }

    const renderInvitationItem = () => {
        if (requestedGroups.length > 0)
            return requestedGroups.map(request => <GroupRequestedItemRow key={request.id} request={request} />);
        return <EmptyInvitationMessage>{t(translations.group.you_have_not_requested_to_join_any_groups)}</EmptyInvitationMessage>
    }

    const onPaginationChanged = (page, size) => {
        getRequestedGroups(page, size);
    }

    React.useEffect(() => {
        getRequestedGroups(1, DEFAULT_PAGE_SIZE);
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
                        <Pagination
                            pageSize={groupRequestedPageSize}
                            onChange={onPaginationChanged}
                            defaultCurrent={groupRequestedCurrentPage}
                            showSizeChanger
                            current={groupRequestedCurrentPage}
                            total={groupRequestedTotalPage} />
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
