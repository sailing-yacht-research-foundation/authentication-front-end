import React from 'react';
import styled from 'styled-components';
import { renderAvatar } from 'utils/user-utils';
import { Image, Dropdown, Menu, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { followProfile, unblockUser } from 'services/live-data-server/profile';
import { FollowStatus } from 'utils/constants';
import { BsCheck, BsPlus, BsCheck2All } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { showToastMessageOnRequestError } from 'utils/helpers';

interface IProfileBasicInfoSection {
    profile: any,
    setShowFollowerModal: Function,
    setShowFollowingModal: Function,
    setFollowStatus: Function,
    handlePostFollowUnfollowAction: Function,
    followStatus: string,
    getUserProfile: Function,
    setShowConfirmBlockModal: Function,
    setShowUnfollowConfirmModal: Function,
}

export const ProfileBasicInfoSection = ({
    profile, setShowFollowerModal, setShowFollowingModal, getUserProfile, setShowConfirmBlockModal, setShowUnfollowConfirmModal,
    setFollowStatus, followStatus, handlePostFollowUnfollowAction }: IProfileBasicInfoSection) => {

    const { t } = useTranslation();

    const showFollowersModal = () => {
        if (profile.followerCount > 0 && (!profile.isPrivate || currentUserId === profile.id))
            setShowFollowerModal(true)
    }

    const showFollowingsModal = () => {
        if (profile.followingCount > 0 && (!profile.isPrivate || currentUserId === profile.id))
            setShowFollowingModal(true)
    }


    const currentUserId = localStorage.getItem('user_id');


    const follow = async () => {
        const response = await followProfile(profile.id);
        if (response.success) {
            setFollowStatus(response?.data?.status);
            handlePostFollowUnfollowAction();
        }
    }

    const renderFollowButton = () => {
        if (currentUserId === profile.id)
            return <></>;

        if (!followStatus)
            return <FollowButton icon={<BsPlus style={{ fontSize: '20px' }} />} onClick={follow} shape="round">{t(translations.public_profile.follow)}</FollowButton>;
        else if (followStatus === FollowStatus.ACCEPTED)
            return <FollowButton icon={<BsCheck2All style={{ fontSize: '20px', marginRight: '5px' }} />} type='primary' onClick={() => setShowUnfollowConfirmModal(true)} shape="round">{t(translations.public_profile.following)}</FollowButton>;
        else if (followStatus === FollowStatus.REQUESTED)
            return <FollowButton icon={<BsCheck style={{ fontSize: '20px' }} />} type='primary' onClick={() => setShowUnfollowConfirmModal(true)} shape="round">{t(translations.public_profile.requested)}</FollowButton>;
    }

    const unblock = async () => {
        const response = await unblockUser(profile.id);

        if (response.success) {
            getUserProfile();
            toast.info(t(translations.public_profile.successfully_unblocked_user, { userName: profile.name }))
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const menu = (
        <Menu>
            {
                !profile.isBlocking ?
                    (<Menu.Item key="1" onClick={() => setShowConfirmBlockModal(true)}>{t(translations.general.block)}</Menu.Item>) :
                    (<Menu.Item key="2" onClick={unblock}>{t(translations.general.unblock)}</Menu.Item>)
            }
        </Menu >
    );

    const renderBlockButton = () => {
        if (currentUserId === profile.id)
            return <></>;

        return <Dropdown.Button trigger={['click']} overlay={menu}></Dropdown.Button>;
    }

    return <>
        <InfoSection>
            <AvatarWrapper>
                <Image src={renderAvatar(profile.avatar, false)} />
            </AvatarWrapper>
            <ProfileName>{profile.name}</ProfileName>
            <ProfileButtonsWrapper>
                <div></div>
                <div>{renderFollowButton()}</div>
                <OptionContainer>
                    {renderBlockButton()}
                </OptionContainer>
            </ProfileButtonsWrapper>
            {profile.isPrivate && <PrivateProfileText>{t(translations.public_profile.profile_is_private)}</PrivateProfileText>}
        </InfoSection>
        <SubInfoSection>
            <InfoItem onClick={showFollowersModal}>
                <InfoNumber>{profile.followerCount}</InfoNumber>
                <InfoTitle>{t(translations.public_profile.followers)}</InfoTitle>
            </InfoItem>
            <InfoItem onClick={showFollowingsModal}>
                <InfoNumber>{profile.followingCount}</InfoNumber>
                <InfoTitle>{t(translations.public_profile.following)}</InfoTitle>
            </InfoItem>
        </SubInfoSection>
    </>;
}

const SubInfoSection = styled.div`
    border-top: 1px solid #eee;
    padding: 15px 5px;

    display: flex;
    justify-content: center;
`;

const InfoItem = styled.div`
    margin: 0 15px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

const InfoNumber = styled.h3`
    margin: 3px 0;
    font-weight: bold;
`;

const InfoTitle = styled.span``;

const ProfileButtonsWrapper = styled.div`
    display: flex;
    align-items: center;
    & > div {
        width: 33%;
    }
`;

const OptionContainer = styled.div`
    text-align: right;
`;

const PrivateProfileText = styled.div`
    color: #00000073;
    padding-bottom: 10px;
`;

const InfoSection = styled.div`
    text-align: center;
`;

const AvatarWrapper = styled.div`
    width: 130px;
    height: 130px;
    display: inline-block;
    margin-top: 30px;
    border-radius: 50%;
    overflow: hidden;

    img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        object-fit: cover;
        border: 1px solid #eee;
    }
`;

const ProfileName = styled.h2`
    margin-top: 15px;
`;

const FollowButton = styled(Button)`
    margin: 15px 0;
`;
