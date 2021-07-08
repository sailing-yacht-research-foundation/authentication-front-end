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
            && selectedProvider.value == FACEBOOK.value) {
            return <FacebookPosts />
        }

        // if (connectedProviders.instagram) {
        //     return <InstgramPost />
        // }

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