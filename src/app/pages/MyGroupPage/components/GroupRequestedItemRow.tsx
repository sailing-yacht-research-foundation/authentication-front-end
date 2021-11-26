import React from 'react';
import styled from 'styled-components';
import { Button, Spin } from 'antd';
import { leaveGroup } from 'services/live-data-server/groups';
import { useGroupSlice } from '../slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectRequestedGroupCurrentPage } from '../slice/selectors';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { uppercaseFirstCharacter } from 'utils/helpers';
import { Link } from 'react-router-dom';
import { MdOutlineUndo } from 'react-icons/md';
import { VisibilityOfGroup } from './VisibilityOfGroup';
import { DEFAULT_GROUP_AVATAR } from 'utils/constants';

export const GroupRequestedItemRow = (props) => {

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { request } = props;

    const { actions } = useGroupSlice();

    const dispatch = useDispatch();

    const currentPage = useSelector(selectRequestedGroupCurrentPage);

    const undoJoin = async (e) => {
        e.stopPropagation();
        setIsLoading(true);
        const response = await leaveGroup(request.group?.id);
        setIsLoading(false);

        if (response.success) {
            dispatch(actions.getRequestedGroups(currentPage));
        } else {
            toast.error(t(translations.group.an_error_happened_when_performing_your_request));
        }
    }

    return (
        <InvitationItem>
            <GroupAvatarContainer>
                <img alt={request.group?.groupName} src={request.group?.groupImage || DEFAULT_GROUP_AVATAR} />
            </GroupAvatarContainer>
            <RightInfoContainer>
                <ItemInfoContainer>
                    <Link to={`/groups/${request.group?.id}`}>{request.group?.groupName}</Link>
                    <InvitationItemGroupMembersCount>{request.group?.groupType && uppercaseFirstCharacter(request.group?.groupType) + ' • '} <VisibilityOfGroup visibility={request.group?.visibility} /> </InvitationItemGroupMembersCount>
                </ItemInfoContainer>
                <GroupItemAction>
                    <Spin spinning={isLoading}>
                        <Button onClick={undoJoin} shape="round" icon={<MdOutlineUndo style={{ marginRight: '10px', fontSize: '17px' }} />}>{t(translations.group.cancel)}</Button>
                    </Spin>
                </GroupItemAction>
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
    display: flex;
    flex-direction: column;
`;

const GroupItemAction = styled.div`
    padding: 0 15px;
    margin-left: auto;
`;

const RightInfoContainer = styled.div`
  margin-left: 15px;
  display: flex;
  flex-direction: row;
  width: 100%;
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