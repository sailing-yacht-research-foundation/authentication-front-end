import React from 'react';
import styled from 'styled-components';
import { GroupInvitationItemRow } from './GroupInvitationItemRow';
import { useDispatch, useSelector } from 'react-redux';
import { selectGroupCurrentPage, selectGroupPageSize, selectInvitationCurrentPage, selectInvitationPageSize, selectInvitations, selectInvitationTotalPage, selectIsModalLoading } from '../slice/selectors';
import { useGroupSlice } from '../slice';
import { Modal, Pagination, Spin } from 'antd';
import { PaginationContainer } from 'app/pages/GroupDetailPage/components/Members';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { DEFAULT_PAGE_SIZE, GroupMemberStatus } from 'utils/constants';

export const InvitationModal = (props) => {

    const { t } = useTranslation();

    const { showModal, setShowModal, reloadParentList } = props;

    const invitations = useSelector(selectInvitations);

    const invitationTotal = useSelector(selectInvitationTotalPage);

    const invitationCurrentPage = useSelector(selectInvitationCurrentPage);

    const myGroupCurrentPage = useSelector(selectGroupCurrentPage);

    const isModalLoading = useSelector(selectIsModalLoading);

    const dispatch = useDispatch();

    const [, setIsLoading] = React.useState<boolean>(false);

    const { actions } = useGroupSlice();

    const [performedAction, setPerformedAction] = React.useState<boolean>(false);

    const groupPageSize = useSelector(selectGroupPageSize);

    const invitationPageSize = useSelector(selectInvitationPageSize);

    const renderInvitationItem = () => {
        if (invitations.length > 0)
            return invitations.map(request => <GroupInvitationItemRow key={request.id} setPerformedAction={setPerformedAction} setIsLoading={setIsLoading} request={request} />);
        return <EmptyInvitationMessage>{t(translations.group.you_dont_have_any_invitations_right_now)}</EmptyInvitationMessage>
    }

    const onPaginationChanged = (page, size) => {
        dispatch(actions.getGroupInvitations({ page: page, size, invitationType: GroupMemberStatus.INVITED }));
    }

    const hideInvitationModal = () => {
        if (reloadParentList && performedAction) {
            dispatch(actions.getGroups({ page: myGroupCurrentPage, size: groupPageSize }));
            reloadParentList();
        }
        setShowModal(false);
    }

    React.useEffect(() => {
        if (showModal)
            dispatch(actions.getGroupInvitations({ page: 1, size: DEFAULT_PAGE_SIZE, invitationType: GroupMemberStatus.INVITED }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal]);

    return (
        <Modal visible={showModal} title={t(translations.group.invitations_title)} footer={null} onCancel={hideInvitationModal}>
            <Spin spinning={isModalLoading}>
                <InvitationList>
                    {renderInvitationItem()}
                </InvitationList>
                <PaginationContainer>
                    {
                        invitationTotal > DEFAULT_PAGE_SIZE && <Pagination
                            onChange={onPaginationChanged}
                            current={invitationCurrentPage}
                            pageSize={invitationPageSize}
                            total={invitationTotal} />
                    }
                </PaginationContainer>
            </Spin>
        </Modal>
    );
}

const InvitationList = styled.div``;

const EmptyInvitationMessage = styled.span``;