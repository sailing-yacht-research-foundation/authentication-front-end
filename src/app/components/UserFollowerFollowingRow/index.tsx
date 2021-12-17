import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { followProfile } from 'services/live-data-server/profile';
import styled from 'styled-components';
import { renderAvatar } from 'utils/user-utils';

export const UserFollowerFollowingRow = ({ profile, profileId }) => {

    const [followStatus, setFollowStatus] = React.useState();

    const follow = async () => {
        const response = await followProfile(profileId);

        if (response.success) {
            console.log(response);
        }
    }

    const unfollow = () => {

    }

    const renderFollowButton = () => {
        return <FollowButton onClick={() => follow()} type="link">Follow</FollowButton>;
    }
    
    return (
        <PeopleItem>
            <PeopleInnerWrapper>
                <PeopleAvatar>
                    <img src={renderAvatar(profile.avatar)} className="avatar-img" />
                </PeopleAvatar>
                <PeopleInfo>
                    <PeopleName to={`/profile/${profile.id || profileId}`}>{profile.name}</PeopleName>
                    <PeopleAlsoFollow>{profile.followerCount} followers</PeopleAlsoFollow>
                </PeopleInfo>
            </PeopleInnerWrapper>
            { renderFollowButton() }
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