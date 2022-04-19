import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Avatar, Spin, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { usePublicProfileSlice } from '../slice';
import { selectGetProfileFailed, selectIsLoadingProfile, selectProfile } from '../slice/selectors';
import { FollowerModal } from './modals/FollowerModal';
import { FollowingModal } from './modals/FollowingModal';
import { blockUser, unfollowProfile } from 'services/live-data-server/profile';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { UnfollowConfirmModal } from 'app/components/SocialProfile/UnfollowConfirmModal';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { ConfirmModal } from 'app/components/ConfirmModal';
import { ProfileBasicInfoSection } from './ProfileBasicInfoSection';
import { StyleConstants } from 'styles/StyleConstants';
import { AntDesignOutlined, UserOutlined } from '@ant-design/icons';

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

    const handlePostFollowUnfollowAction = () => {
        dispatch(actions.getFollowing({ profileId: profile.id, page: 1 }));
        dispatch(actions.getFollowers({ profileId: profile.id, page: 1 }));
        getUserProfile();
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
                    <ProfileBasicInfoSection
                        profile={profile}
                        handlePostFollowUnfollowAction={handlePostFollowUnfollowAction}
                        setShowFollowerModal={setShowFollowerModal}
                        setShowFollowingModal={setShowFollowingModal}
                        setFollowStatus={setFollowStatus}
                        getUserProfile={getUserProfile}
                        setShowConfirmBlockModal={setShowConfirmBlockModal}
                        setShowUnfollowConfirmModal={setShowUnfollowConfirmModal}
                        followStatus={followStatus} />
                </SectionWrapper>

                <SectionWrapper>
                    <SectionTitle>About</SectionTitle>
                    <p>{profile.bio}</p>
                </SectionWrapper>

                <SectionWrapper>
                    <SectionTitle>Interests</SectionTitle>
                    <InterestWrapper>
                        <Interest><ItemAvatar src={`/sport-logos/${String('winging').toLowerCase()}.svg`} /> Cruising</Interest>
                        <Interest><ItemAvatar src={`/sport-logos/${String('winging').toLowerCase()}.svg`} /> Handicap</Interest>
                        <Interest><ItemAvatar src={`/sport-logos/${String('winging').toLowerCase()}.svg`} /> One Design</Interest>
                    </InterestWrapper>
                </SectionWrapper>

                <SectionWrapper>
                    <SectionTitle>Groups & Organizations</SectionTitle>
                    <Avatar.Group>
                        <Avatar src="https://joeschmoe.io/api/v1/random" />
                        <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                        <Tooltip title="Ant User" placement="top">
                            <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                        </Tooltip>
                        <Avatar style={{ backgroundColor: '#1890ff' }} icon={<AntDesignOutlined />} />
                    </Avatar.Group>
                </SectionWrapper>
            </Spin>
        </Wrapper>
    );
}

const SectionWrapper = styled.div`
    padding: 10px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    &:not(:first-child) {
        margin-top: 10px;
    }
`;

const Wrapper = styled.div`
    flex: .7;
    .ant-dropdown-button .ant-dropdown-trigger {
        border-radius: 10px !important;
    }
`;

const SectionTitle = styled.h3`
    margin-bottom: 15px;
`;

const InterestWrapper = styled.div`
    display: flex;
`;

const Interest = styled.div`
    background: ${StyleConstants.SECONDARY_COLOR};
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 4px 7px;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    display: flex;
    align-items: center;
`;

const ItemAvatar = styled.img`
    with: 25px;
    height: 25px;
    margin-right: 5px;
    border-radius: 50%;
`;