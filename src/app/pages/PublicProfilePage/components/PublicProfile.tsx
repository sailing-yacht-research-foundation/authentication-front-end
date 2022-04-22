import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Image, Spin, Menu, Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { usePublicProfileSlice } from '../slice';
import { selectGetProfileFailed, selectIsLoadingProfile, selectProfile } from '../slice/selectors';
import { FollowerModal } from './modals/FollowerModal';
import { FollowingModal } from './modals/FollowingModal';
import { renderAvatar } from 'utils/user-utils';
import { FollowStatus } from 'utils/constants';
import { blockUser, followProfile, unblockUser, unfollowProfile } from 'services/live-data-server/profile';
import { BsCheck, BsPlus, BsCheck2All } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { UnfollowConfirmModal } from 'app/components/SocialProfile/UnfollowConfirmModal';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { ConfirmModal } from 'app/components/ConfirmModal';

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

    const [showConfirmBlockModal, setShowConfirmBlockModal] = React.useState<boolean>(false);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

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
        setIsLoading(true);
        const response = await unfollowProfile(profile.id);
        setIsLoading(false);

        setShowUnfollowConfirmModal(false);
        if (response.success) {
            setFollowStatus(response?.data?.status);
            handlePostFollowUnfollowAction();
        }
    }

    const block = async () => {
        setIsLoading(true);
        const response = await blockUser(profile.id);
        setIsLoading(false);

        if (response.success) {
            getUserProfile();
            toast.info(t(translations.public_profile.successfully_blocked_user, { userName: profile.name }));
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowConfirmBlockModal(false);
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

    const renderBlockButton = () => {
        if (currentUserId === profile.id)
            return <></>;

        return <Dropdown.Button  trigger={['click']} overlay={menu}></Dropdown.Button>;
    }

    const menu = (
        <Menu>
            {
                !profile.isBlocking ?
                    (<Menu.Item key="1" onClick={() => setShowConfirmBlockModal(true)}>{t(translations.public_profile.block)}</Menu.Item>) :
                    (<Menu.Item key="2" onClick={unblock}>{t(translations.public_profile.unblock)}</Menu.Item>)
            }
        </Menu >
    );

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
            <ConfirmModal
                loading={isLoading}
                showModal={showConfirmBlockModal}
                title={t(translations.public_profile.are_you_sure_you_want_to_block, { userName: profile.name })}
                content={t(translations.public_profile.are_you_really_sure_you_want_to_block_user_they_will_no_longer_see_you_on_syrf_and, { userName: profile.name })}
                onOk={block}
                onCancel={() => setShowConfirmBlockModal(false)} />
            <UnfollowConfirmModal isLoading={isLoading} profileName={profile.name} unfollow={unfollow} visible={showConfirmUnfollowModal} hideModal={() => setShowUnfollowConfirmModal(false)} />
            {
                profile.id && (!profile.isPrivate || currentUserId === profile.id) && <>
                    <FollowerModal reloadParent={handlePostFollowUnfollowAction} profileId={profileId || currentUserId} showModal={showFollowerModal} setShowModal={setShowFollowerModal} />
                    <FollowingModal reloadParent={handlePostFollowUnfollowAction} profileId={profileId || currentUserId} showModal={showFollowingModal} setShowModal={setShowFollowingModal} />
                </>
            }
            <Spin spinning={isLoadingProfile}>
                <SectionWrapper>
                    <InfoSection>
                        <AvatarWrapper>
                            <Image src={renderAvatar(profile.avatar)} />
                        </AvatarWrapper>
                        <ProfileName>{profile.name}</ProfileName>
                        <ProfileBio>{profile.bio}</ProfileBio>
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
                </SectionWrapper>
            </Spin>
        </Wrapper>
    );
}

const SectionWrapper = styled.div`
    padding: 10px;
    :not(:first-child) {
        margin-top: 30px;
    }
`;

const Wrapper = styled.div`
    flex: .7;
    background: #fff;
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