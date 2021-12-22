import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { renderAvatar } from 'utils/user-utils';
import { BsCheck, BsPlus, BsCheck2All } from 'react-icons/bs';
import { FollowStatus } from 'utils/constants';
import { UnfollowConfirmModal } from 'app/components/SocialProfile/UnfollowConfirmModal';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { followProfile, unfollowProfile } from 'services/live-data-server/profile';

export const ResultItem = ({ profile }) => {

    const [followStatus, setFollowStatus] = React.useState<any>(profile.followStatus);

    const currentUserId = localStorage.getItem('user_id');

    const { t } = useTranslation();

    const [showUnfollowModal, setShowUnfollowModal] = React.useState<boolean>(false);

    const follow = async () => {
        const response = await followProfile(profile.id);
        if (response.success) {
            setFollowStatus(response?.data?.status);
        }
    }

    const unfollow = async () => {
        const response = await unfollowProfile(profile.id);
        setShowUnfollowModal(false);
        if (response.success) {
            setFollowStatus(response?.data?.status);
        }
    }

    const renderFollowButton = () => {
        if (currentUserId === profile.id)
            return <></>;

        if (!followStatus)
            return <FollowButton icon={<BsPlus style={{ fontSize: '20px' }} />} onClick={follow} shape="round">{t(translations.public_profile.follow)}</FollowButton>;
        else if (followStatus === FollowStatus.ACCEPTED)
            return <FollowButton icon={<BsCheck2All style={{ fontSize: '20px', marginRight: '5px' }} />} type='primary' onClick={() => setShowUnfollowModal(true)} shape="round">{t(translations.public_profile.following)}</FollowButton>;
        else if (followStatus === FollowStatus.REQUESTED)
            return <FollowButton icon={<BsCheck style={{ fontSize: '20px' }} />} type='primary' onClick={() => setShowUnfollowModal(true)} shape="round">{t(translations.public_profile.requested)}</FollowButton>;
    }

    return (
        <PeopleItem>
            <UnfollowConfirmModal profileName={profile.name} unfollow={unfollow} hideModal={() => setShowUnfollowModal(false)} visible={showUnfollowModal} />
            <PeopleInnerWrapper>
                <PeopleAvatar>
                    <img src={renderAvatar(profile.avatar)} className="avatar-img" />
                </PeopleAvatar>
                <PeopleInfo>
                    <PeopleName to={`/profile/${profile.id}`}>{profile.name}</PeopleName>
                    <PeopleAlsoFollow>{profile.bio}</PeopleAlsoFollow>
                </PeopleInfo>
            </PeopleInnerWrapper>
            {renderFollowButton()}
        </PeopleItem>
    );
}

const PeopleItem = styled.div`
    display: flex;
    align-items: center;
    text-align: left;
    &:not(:last-child) {
       padding-bottom: 20px;
       margin-bottom: 10px;
       border-bottom: 1px solid #eee;
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

const FollowButton = styled(Button)`
   margin-left: auto;
`;

const PeopleInnerWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 0 0 auto;
`;

const PeopleAlsoFollow = styled.span``;