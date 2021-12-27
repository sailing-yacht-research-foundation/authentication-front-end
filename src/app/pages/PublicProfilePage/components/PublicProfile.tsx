import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Image, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { usePublicProfileSlice } from '../slice';
import { selectGetProfileFailed, selectIsLoadingProfile, selectProfile } from '../slice/selectors';
import { FollowerModal } from './modals/FollowerModal';
import { FollowingModal } from './modals/FollowingModal';
import { renderAvatar } from 'utils/user-utils';
import { FollowStatus } from 'utils/constants';
import { followProfile, unfollowProfile } from 'services/live-data-server/profile';
import { BsCheck, BsPlus, BsCheck2All } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { UnfollowConfirmModal } from 'app/components/SocialProfile/UnfollowConfirmModal';

export const PublicProfile = () => {

    const currentUserId = localStorage.getItem('user_id');

    const { profileId } = useParams<{ profileId: string }>();

    const profile = useSelector(selectProfile);

    const location = useLocation();

    const dispatch = useDispatch();

    const history = useHistory();

    const { actions } = usePublicProfileSlice();

    const [showFollowerModal, setShowFollowerModal] = React.useState<boolean>(false);

    const [showFollowingModal, setShowFollowingModal] = React.useState<boolean>(false);

    const [showConfirmUnfollowModal, setShowUnfollowConfirmModal] = React.useState<boolean>(false);

    const getProfileFailed = useSelector(selectGetProfileFailed);

    const isLoadingProfile = useSelector(selectIsLoadingProfile);

    const [followStatus, setFollowStatus] = React.useState<any>(null);

    const { t } = useTranslation();

    const getUserProfile = async () => {
        dispatch(actions.getProfile(profileId || currentUserId));
    }

    const follow = async () => {
        const response = await followProfile(profile.id);
        if (response.success) {
            setFollowStatus(response?.data?.status);
            handlePostFollowUnfollowAction();
        }
    }

    const unfollow = async () => {
        const response = await unfollowProfile(profile.id);
        setShowUnfollowConfirmModal(false);
        if (response.success) {
            setFollowStatus(response?.data?.status);
            handlePostFollowUnfollowAction();
        }
    }

    const handlePostFollowUnfollowAction = () => {
        dispatch(actions.getFollowing({ profileId: profile.id, page: 1 }));
        dispatch(actions.getFollowers({ profileId: profile.id, page: 1 }));
        getUserProfile();
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

    const showFollowersModal = () => {
        if (profile.followerCount > 0 && (!profile.isPrivate || currentUserId === profile.id))
            setShowFollowerModal(true)
    }

    const showFollowingsModal = () => {
        if (profile.followingCount > 0 && (!profile.isPrivate || currentUserId === profile.id))
            setShowFollowingModal(true)
    }

    React.useEffect(() => {
        if (getProfileFailed)
            history.push('/');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getProfileFailed]);

    React.useEffect(() => {
        getUserProfile();
        setShowFollowingModal(false);
        setShowFollowerModal(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    React.useEffect(() => {
        if (profile.id) {
            setFollowStatus(profile.followStatus);
        }
    }, [profile]);

    return (
        <Wrapper>
            <UnfollowConfirmModal profileName={profile.name} unfollow={unfollow} visible={showConfirmUnfollowModal} hideModal={() => setShowUnfollowConfirmModal(false)} />
            {
                profile.id && (!profile.isPrivate || currentUserId === profile.id) && <>
                    <FollowerModal reloadParent={handlePostFollowUnfollowAction} profileId={profileId || currentUserId} showModal={showFollowerModal} setShowModal={setShowFollowerModal} />
                    <FollowingModal reloadParent={handlePostFollowUnfollowAction} profileId={profileId || currentUserId} showModal={showFollowingModal} setShowModal={setShowFollowingModal} />
                </>
            }
            <Spin spinning={isLoadingProfile}>
                <InfoSection>
                    <AvatarWrapper>
                        <Image src={renderAvatar(profile.avatar)} />
                    </AvatarWrapper>
                    <ProfileName>{profile.name}</ProfileName>
                    <ProfileBio>{profile.bio}</ProfileBio>
                    {renderFollowButton()}
                    {profile.isPrivate && <div>{t(translations.public_profile.profile_is_private)}</div>}
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
            </Spin>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    background: #fff;
    flex: .7;
`;

const InfoSection = styled.div`
    text-align: center;
    padding: 10px;
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

const ProfileBio = styled.p`

`;

const FollowButton = styled(Button)`
    margin: 15px 0;
`;

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