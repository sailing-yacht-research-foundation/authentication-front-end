import React from 'react';
import styled from 'styled-components';
import { Space, Button } from 'antd';
import { userAcceptInvitationRequest, userRejectInvitationRequest } from 'services/live-data-server/groups';
import { useGroupSlice } from '../slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectInvitationCurrentPage } from '../slice/selectors';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { GroupMemberStatus } from 'utils/constants';

export const InvitationItemRow = (props) => {

    const { t } = useTranslation();

    const { request, setIsLoading, reloadInvitationList } = props;

    const { actions } = useGroupSlice();

    const dispatch = useDispatch();

    const invitationCurrentPage = useSelector(selectInvitationCurrentPage);

    const acceptJoinRequest = async () => {
        setIsLoading(true);
        const response = await userAcceptInvitationRequest(request.id);
        setIsLoading(false);

        if (response.success) {
            dispatch(actions.getGroupInvitations({ page: invitationCurrentPage, invitationType: GroupMemberStatus.invited }));
            if (reloadInvitationList) reloadInvitationList();
        } else {
            toast.error(t(translations.group.an_error_happened_when_performing_your_request));
        }
    }

    const rejectJoinRequest = async () => {
        setIsLoading(true);
        const response = await userRejectInvitationRequest(request.id);
        setIsLoading(false);

        if (response.success) {
            dispatch(actions.getGroupInvitations({ page: invitationCurrentPage, invitationType: GroupMemberStatus.invited }));
            if (reloadInvitationList) reloadInvitationList();
        } else {
            toast.error(t(translations.group.an_error_happened_when_performing_your_request));
        }
    }

    return (
        <InvitationItem>
            <ItemInfoContainer>
                <InvitationItemTitle>{request.group?.groupName}</InvitationItemTitle>
                <InvitationItemGroupMembersCount>{request.group?.groupType}</InvitationItemGroupMembersCount>
            </ItemInfoContainer>
            <ItemButtonContainer>
                <Space size={5}>
                    <Button onClick={acceptJoinRequest} type="primary">{t(translations.group.join)}</Button>
                    <Button onClick={rejectJoinRequest}>{t(translations.group.cancel)}</Button>
                </Space>
            </ItemButtonContainer>
        </InvitationItem>
    )
}

const InvitationItem = styled.div`
    padding: 15px 5px;
    display: flex;
    flex-direction: row;
    align-items: center;

    &:not(:last-child) {
        border-bottom: 1px solid #eee;
    }
`;

const InvitationItemTitle = styled.a``;

const InvitationItemGroupMembersCount = styled.span`
    margin-top: 5px;
`;

const ItemInfoContainer = styled.div`
    width: 60%;
    display: flex;
    flex-direction: column;

`;

const ItemButtonContainer = styled.div`
    text-align: right;
    display: block;
    width: 40%;
`;