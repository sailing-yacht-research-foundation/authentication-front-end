import { Button } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { renderAvatar } from 'utils/user-utils';

export const ResultItem = ({ profile }) => {

    return (
        <PeopleItem>
            <PeopleInnerWrapper>
                <PeopleAvatar>
                    <img src={renderAvatar(profile.avatar)} className="avatar-img" />
                </PeopleAvatar>
                <PeopleInfo>
                    <PeopleName to={`/profile/${profile.id}`}>{profile.name}</PeopleName>
                    <PeopleAlsoFollow>{profile.bio}</PeopleAlsoFollow>
                </PeopleInfo>
            </PeopleInnerWrapper>
            <FollowButton type="link">Follow</FollowButton>
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