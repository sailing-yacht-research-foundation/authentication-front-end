import React from 'react';
import styled from 'styled-components';
import { Space, Button } from 'antd';
import { userAcceptInvitationRequest, userRejectInvitationRequest } from 'services/live-data-server/groups';
import { useGroupSlice } from '../slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectGroupCurrentPage, selectGroupPageSize, selectInvitationCurrentPage } from '../slice/selectors';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { DEFAULT_GROUP_AVATAR, GroupMemberStatus } from 'utils/constants';
import { renderGroupAvatarAsThumbnail, showToastMessageOnRequestError, uppercaseFirstCharacter } from 'utils/helpers';
import { Link } from 'react-router-dom';
import { VisibilityOfGroup } from './VisibilityOfGroup';

export const GroupInvitationItemRow = (props) => {

    const { t } = useTranslation();

    const { request, setIsLoading, reloadParentList, setPerformedAction, hideButtons } = props;

    const { actions } = useGroupSlice();

    const dispatch = useDispatch();

    const invitationCurrentPage = useSelector(selectInvitationCurrentPage);

    const groupCurrentPage = useSelector(selectGroupCurrentPage);

    const groupPageSize = useSelector(selectGroupPageSize);

    const acceptJoinRequest = async () => {
        setIsLoading(true);
        const response = await userAcceptInvitationRequest(request.id);
        setIsLoading(false);

        if (response.success) {
            dispatch(actions.getGroupInvitations({ page: invitationCurrentPage, invitationType: GroupMemberStatus.INVITED }));
            dispatch(actions.getGroups({ page: groupCurrentPage, size: groupPageSize }));
            if (reloadParentList) reloadParentList();
            if (setPerformedAction)
                setPerformedAction(true);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const rejectJoinRequest = async () => {
        setIsLoading(true);
        const response = await userRejectInvitationRequest(request.id);
        setIsLoading(false);

        if (response.success) {
            dispatch(actions.getGroupInvitations({ page: invitationCurrentPage, invitationType: GroupMemberStatus.INVITED }));
            if (reloadParentList) reloadParentList();
            if (setPerformedAction)
                setPerformedAction(true);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <InvitationItem>
            <GroupAvatarContainer>
                <img alt={request.group?.groupName} src={renderGroupAvatarAsThumbnail(request.group?.groupImage) || DEFAULT_GROUP_AVATAR} />
            </GroupAvatarContainer>
            <RightInfoContainer>
                <ItemInfoContainer>
                    <Link to={`/groups/${request.group?.id}`}>{request.group?.groupName}</Link>
                    <InvitationItemGroupMembersCount>{request.group?.groupType && uppercaseFirstCharacter(request.group?.groupType) + ' • '} <VisibilityOfGroup visibility={request.group?.visibility} /> </InvitationItemGroupMembersCount>
                </ItemInfoContainer>
                {
                    !hideButtons && <ItemButtonContainer>
                        <Space size={5}>
                            <Button onClick={acceptJoinRequest} type="primary">{t(translations.group.join)}</Button>
                            <Button onClick={rejectJoinRequest}>{t(translations.general.cancel)}</Button>
                        </Space>
                    </ItemButtonContainer>
                }
            </RightInfoContainer>
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
    display: flex;
`;

const GroupAvatarContainer = styled.div`
   width: 40px;
   height: 40px;
   flex: 0 0 auto;

   img {
       width: 100%;
       height: 100%;
       object-fit: cover;
       border-radius: 50%;
   }
`;

const RightInfoContainer = styled.div`
  margin-left: 15px;
  display: flex;
  flex-direction: row;
  width: 100%;
`;
