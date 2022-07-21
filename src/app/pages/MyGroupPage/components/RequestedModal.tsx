import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { selectGroupCurrentPage, selectGroupPageSize, selectRequestedGroupCurrentPage, selectRequestedGroupPageSize, selectRequestedGroups, selectRequestedGroupTotalPage } from '../slice/selectors';
import { useGroupSlice } from '../slice';
import { Modal, Pagination, Spin } from 'antd';
import { PaginationContainer } from 'app/pages/GroupDetailPage/components/Members';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { DEFAULT_PAGE_SIZE } from 'utils/constants';
import { GroupInvitationItemRow } from './GroupInvitationItemRow';

export const RequestedModal = (props) => {

    const { t } = useTranslation();

    const { showModal, setShowModal, reloadParentList } = props;

    const requested = useSelector(selectRequestedGroups);

    const requestedTotal = useSelector(selectRequestedGroupTotalPage);

    const requestedCurrentPage = useSelector(selectRequestedGroupCurrentPage);

    const myGroupCurrentPage = useSelector(selectGroupCurrentPage);

    const groupPageSize = useSelector(selectGroupPageSize);

    const requestedGroupPageSize = useSelector(selectRequestedGroupPageSize);

    const dispatch = useDispatch();

    const { actions } = useGroupSlice();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const renderInvitationItem = () => {
        if (requested.length > 0)
            return requested.map((request) => <GroupInvitationItemRow hideButtons key={request.id} setIsLoading={setIsLoading} request={request} />);
        return <EmptyInvitationMessage>{t(translations.group.you_have_not_requested_to_join_any_groups)}</EmptyInvitationMessage>
    }

    const onPaginationChanged = (page, size) => {
        dispatch(actions.getRequestedGroups({ page: page, size: size }));
    }

    const hideInvitationModal = () => {
        dispatch(actions.getGroups({ page: myGroupCurrentPage, size: groupPageSize }));
        if (reloadParentList) reloadParentList();
        setShowModal(false);
    }

    React.useEffect(() => {
        if (showModal)
            dispatch(actions.getRequestedGroups({ page: 1, size: DEFAULT_PAGE_SIZE }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal]);

    return (
        <Modal visible={showModal} title={t(translations.group.requested)} footer={null} onCancel={hideInvitationModal}>
            <Spin spinning={isLoading}>
                <InvitationList>
                    {renderInvitationItem()}
                </InvitationList>
                <PaginationContainer>
                    {
                        requestedTotal > DEFAULT_PAGE_SIZE && <Pagination
                            onChange={onPaginationChanged}
                            current={requestedCurrentPage}
                            pageSize={requestedGroupPageSize}
                            showSizeChanger
                            total={requestedTotal} />
                    }
                </PaginationContainer>
            </Spin>
        </Modal>
    );
}

const InvitationList = styled.div``;

const EmptyInvitationMessage = styled.span``;
