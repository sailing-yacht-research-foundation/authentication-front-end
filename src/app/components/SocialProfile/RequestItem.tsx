import React from 'react';
import styled from 'styled-components';
import { Space, Button, Spin, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { renderAvatar } from '../../../utils/user-utils';
import { acceptFollowRequest, rejectFollowRequest } from '../../../services/live-data-server/profile';
import { translations } from 'locales/translations';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { SYRFImage } from '../SyrfGeneral/SYRFImage';

interface IRequestItem {
    request: any,
    hideModal?: Function,
    reloadParentList?: Function
}

export const RequestItem = (props: IRequestItem) => {

    const { t } = useTranslation();

    const { request, reloadParentList, hideModal } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const history = useHistory();

    const acceptJoinRequest = async () => {
        setIsLoading(true);
        const response = await acceptFollowRequest(request.followerId);
        setIsLoading(false);

        if (response.success) {
            if (reloadParentList) reloadParentList();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const rejectJoinRequest = async () => {
        setIsLoading(true);
        const response = await rejectFollowRequest(request.followerId);
        setIsLoading(false);

        if (response.success) {
            if (reloadParentList) reloadParentList();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const showFollowerProfile = () => {
        history.push(`/profile/${request.followerId}`);
        if (hideModal) {
            hideModal();
        }
    }

    return (
        <Spin spinning={isLoading}>
            <InvitationItem>
                <AvatarContainer>
                    <SYRFImage alt={request.name} src={renderAvatar(request.avatar)} />
                </AvatarContainer>
                <RightInfoContainer>
                    <ItemInfoContainer>
                        <FollowerName onClick={showFollowerProfile}>{request.name}</FollowerName>
                        <span>{request.followerCount}</span>
                    </ItemInfoContainer>
                    <ItemButtonContainer>
                        <Space size={10} wrap style={{ justifyContent: 'flex-end' }}>
                            <Tooltip title={t(translations.general.accept)}>
                                <Button icon={<FaCheck/>} onClick={acceptJoinRequest} type="primary" />
                            </Tooltip>

                            <Tooltip title={t(translations.general.reject)}>
                                <Button icon={<FaTimes/>} onClick={rejectJoinRequest} />
                            </Tooltip>
                        </Space>
                    </ItemButtonContainer>
                </RightInfoContainer>
            </InvitationItem>
        </Spin>
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

const AvatarContainer = styled.div`
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

const FollowerName = styled.div`
   color: #1890ff;
   cursor: pointer;
`;
