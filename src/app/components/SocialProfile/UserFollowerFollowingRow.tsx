import React from 'react';
import { Link } from 'react-router-dom';
import { followProfile, unfollowProfile } from 'services/live-data-server/profile';
import styled from 'styled-components';
import { FollowStatus } from 'utils/constants';
import { renderAvatar } from 'utils/user-utils';
import { Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { UnfollowConfirmModal } from './UnfollowConfirmModal';

export const UserFollowerFollowingRow = (props) => {

    const { profile, profileId, reloadParentList, setPerformedAction } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [followStatus, setFollowStatus] = React.useState<any>(profile.followStatus);

    const currentUserId = localStorage.getItem('user_id');

    const [showUnfollowModal, setShowUnfollowModal] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const follow = async () => {
        setIsLoading(true);
        const response = await followProfile(profile.id || profileId);
        setIsLoading(false);
        handlePostFollowUnfollowAction(response);
    }

    const unfollow = async () => {
        setIsLoading(true);
        const response = await unfollowProfile(profile.id || profileId);
        setIsLoading(false);
        handlePostFollowUnfollowAction(response);
        setShowUnfollowModal(false);
    }

    const handlePostFollowUnfollowAction = (response) => {
        if (response.success) {
            if (setPerformedAction && typeof setPerformedAction === 'function') {
                setPerformedAction(true)
            }

            setFollowStatus(response?.data?.status);
            if (reloadParentList && typeof reloadParentList === 'function') {
                reloadParentList();
            }
        }
    }

    React.useEffect(() => {
        setFollowStatus(profile.followStatus);
    }, [profile]);

    const renderFollowButton = () => {
        if (currentUserId === profileId)
            return <></>;

        if (!followStatus)
            return <Spin spinning={isLoading}><FollowButton type='link' onClick={follow}>{t(translations.public_profile.follow)}</FollowButton></Spin>;
        else if (followStatus === FollowStatus.ACCEPTED)
            return <Spin spinning={isLoading}><FollowButton type='link' onClick={() => setShowUnfollowModal(true)}>{t(translations.public_profile.following)}</FollowButton></Spin>;
        else if (followStatus === FollowStatus.REQUESTED)
            return <Spin spinning={isLoading}><FollowButton type='link' onClick={() => setShowUnfollowModal(true)}>{t(translations.public_profile.requested)}</FollowButton></Spin>;
    }

    return (
        <PeopleItem>
            <UnfollowConfirmModal profileName={profile.name} visible={showUnfollowModal} unfollow={unfollow} hideModal={() => setShowUnfollowModal(false)} />
            <PeopleInnerWrapper>
                <PeopleAvatar>
                    <img src={renderAvatar(profile.avatar)} className="avatar-img" />
                </PeopleAvatar>
                <PeopleInfo>
                    <PeopleName to={`/profile/${profile.id || profileId}`}>{profile.name}</PeopleName>
                    {(profile.followerCount || profile.followerGained) && <PeopleAlsoFollow>{t(translations.public_profile.number_followers, { numberOfFollowers: profile.followerCount || profile.followerGained })}</PeopleAlsoFollow>}
                </PeopleInfo>
            </PeopleInnerWrapper>
            <FollowButtonOuter>
                {renderFollowButton()}
            </FollowButtonOuter>
        </PeopleItem>
    );
}

const PeopleItem = styled.div`
    display: flex;
    align-items: center;
   &:not(:last-child) {
       margin-bottom: 20px;
   }
`;

const PeopleInfo = styled.div`
    margin-left: 15px;
`;

const PeopleAvatar = styled.div`
    width: 45px;
    height: 45px;
`;

const PeopleName = styled(Link)`
    display: block;
`;

const FollowButton = styled(Button)``;

const PeopleInnerWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 0 0 auto;
`;

const PeopleAlsoFollow = styled.span``;

const FollowButtonOuter = styled.div`
    margin-left: auto;
`;