import React, { useState } from 'react';
import { Row } from 'antd';
import { FacebookIntegration, FacebookPosts } from './Facebook';
import { InstagramIntegration } from './Instagram';
import { TwitterIntegration } from './Twitter';
import {
    SyrfFormWrapper,
    SyrfFormTitle
} from 'app/components/SyrfForm';
import { useEffect } from 'react';
import { media } from 'styles/media';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { getUserAttribute } from 'utils/user-utils';
import InstagramPosts from './Instagram/components/InstagramPost';

const FACEBOOK = {
    name: 'Facebook',
    value: 0
};
const INSTAGRAM = {
    name: 'Instagram',
    value: 1
}
const TWITTER = {
    name: 'Twitter',
    value: 2
}

export const LinkToProviders = () => {
    const [selectedProvider, setSelectedProvider] = useState(FACEBOOK);

    const user = useSelector(selectUser);

    const [connectedProviders, setConnectedProviders] = useState({
        facebook: !!getUserAttribute(user, 'custom:fb_token'),
        instagram: !!getUserAttribute(user, 'custom:ig_token'),
        twitter: !!getUserAttribute(user, 'custom:twitter_token'),
    });

    useEffect(() => {
        setConnectedProviders({
            facebook: !!getUserAttribute(user, 'custom:fb_token'),
            instagram: !!getUserAttribute(user, 'custom:ig_token'),
            twitter: !!getUserAttribute(user, 'custom:twitter_token'),
        })
    }, [user]);

    const renderPostsByProvider = () => {
        if (connectedProviders.facebook
            && selectedProvider.value === FACEBOOK.value) {
            return <FacebookPosts />
        } else if (connectedProviders.instagram 
            && selectedProvider.value === INSTAGRAM.value) {
            return <InstagramPosts />
        }

        // if (connectedProviders.twitter) {
        //     return <Twitte />
        // }

        return (<NotConnectedMessage>Please connect to {selectedProvider.name} to see your posts</NotConnectedMessage>);
    }

    return (
        <>
            <SyrfFormWrapper style={{ marginTop: '33px' }}>
                <SyrfFormTitle>Social Profiles Connection</SyrfFormTitle>
                <StyledRow justify="start" align="middle">
                    <FacebookIntegration
                        onClick={() => setSelectedProvider(FACEBOOK)}
                        active={selectedProvider === FACEBOOK} />
                    <InstagramIntegration
                        onClick={() => setSelectedProvider(INSTAGRAM)}
                        active={selectedProvider === INSTAGRAM} />
                    <TwitterIntegration
                        onClick={() => setSelectedProvider(TWITTER)}
                        active={selectedProvider === TWITTER} />
                </StyledRow>

                <PostsWrapper>
                    {renderPostsByProvider()}
                </PostsWrapper>

            </SyrfFormWrapper>
        </>
    )
}

const StyledRow = styled(Row)`
    justify-content: center;

    ${media.medium`
        justify-content: flex-start;
    `}
`;

const PostsWrapper = styled.div`
    margin-top: 20px;
`;

const NotConnectedMessage = styled.div`
    text-align: center;
`;

export const PostInnerWrapper = styled.div`
    background: #eee;
    padding: 10px;
`;

export const Post = styled.div`
    background: #fff;
    padding: 15px;
    margin-bottom: 15px;
`;

export const PostUserWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`;

export const UserAvatar = styled.div`
    border-radius: 50%;
    width: 45px;
    height: 45px;
    margin-right: 20px;
`;

export const PostUserName = styled.div`
    font-weight: 700;
`;

export const PostCaption = styled.p`
    margin: 10px;
`;