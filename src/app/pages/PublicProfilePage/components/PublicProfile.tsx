import React, { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Image, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { usePublicProfileSlice } from '../slice';
import { selectGetProfileFailed, selectIsLoadingProfile, selectProfile } from '../slice/selectors';
import { FollowerModal } from './modals/FollowerModal';
import { FollowingModal } from './modals/FollowingModal';
import { renderAvatar } from 'utils/user-utils';

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

    const getProfileFailed = useSelector(selectGetProfileFailed);

    const isLoadingProfile = useSelector(selectIsLoadingProfile);

    const getUserProfile = async () => {
        dispatch(actions.getProfile(profileId));
    }

    const renderFollowButton = () => {
        // if (currentUserId !== profile.id) {
        //     if (!profile.isFollowed)
        //         return <FollowButton onClick={() => followProfile()} shape="round">Follow</FollowButton>;
        return <FollowButton type='primary' shape="round">Following</FollowButton>;
        // }
        return <></>;
    }

    React.useEffect(() => {
        if (getProfileFailed)
            history.push('/');
    }, [getProfileFailed]);

    React.useEffect(() => {
        getUserProfile();
        setShowFollowingModal(false);
        setShowFollowerModal(false);
    }, [location]);

    return (
        <Wrapper>
            <FollowerModal profileId={profileId} showModal={showFollowerModal} setShowModal={setShowFollowerModal} />
            <FollowingModal profileId={profileId} showModal={showFollowingModal} setShowModal={setShowFollowingModal} />
            <Spin spinning={isLoadingProfile}>
            <InfoSection>
                <AvatarWrapper>
                    <Image src={renderAvatar(profile.avatar)} />
                </AvatarWrapper>
                <ProfileName>{profile.name}</ProfileName>
                <ProfileBio>{profile.bio}</ProfileBio>
                {renderFollowButton()}
            </InfoSection>
            <SubInfoSection>
                <InfoItem onClick={() => { if (profile.followerCount > 0) setShowFollowerModal(true) }}>
                    <InfoNumber>{profile.followerCount}</InfoNumber>
                    <InfoTitle>Followers</InfoTitle>
                </InfoItem>
                <InfoItem onClick={() => { if (profile.followingCount > 0) setShowFollowingModal(true) }}>
                    <InfoNumber>{profile.followingCount}</InfoNumber>
                    <InfoTitle>Following</InfoTitle>
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

const InfoTitle = styled.span`

`;

const FollowedBy = styled.div`
    color: rgba(142,142,142,1);
`;