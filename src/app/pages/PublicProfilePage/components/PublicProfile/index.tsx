import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';

export const PublicProfile = () => {
    return (
        <Wrapper>
            <InfoSection>
                <AvatarWrapper>
                    <img src="https://1.bp.blogspot.com/--JFmzWfIZcE/X6kMkOZdzUI/AAAAAAAAA8c/8c1NpUOMdWYZOKHeWxQvwyVCyXjK_U28QCLcBGAsYHQ/s1280/Neumorphism%2BProfile%2BCard%2BUI%2BDesign%2Busing%2Bonly%2BHTML%2B%2526%2BCSS.webp"/>
                </AvatarWrapper>
                <ProfileName>Dat Dang</ProfileName>            
                <ProfileBio>The Biotechnology Innovation Organization is the largest advocacy association in the world</ProfileBio> 
                <FollowButton shape="round">Follow</FollowButton>   
            </InfoSection>
            <SubInfoSection>
                <InfoItem>
                    <InfoNumber>2000</InfoNumber>
                    <InfoTitle>Followers</InfoTitle>
                </InfoItem>
                <InfoItem>
                    <InfoNumber>2000</InfoNumber>
                    <InfoTitle>Following</InfoTitle>
                </InfoItem>
            </SubInfoSection>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    background: #fff;
    width: 55%;
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
    padding: 5px;
    padding-top: 20px;

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
`;

const InfoNumber = styled.h3`
    margin: 3px 0;
    font-weight: bold;
`;

const InfoTitle = styled.span`

`;