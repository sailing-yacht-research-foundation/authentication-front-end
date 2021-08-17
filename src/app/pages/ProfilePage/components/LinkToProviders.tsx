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
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

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

    const { t } = useTranslation();

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

        return (<NotConnectedMessage>{t(translations.profile_page.update_profile.please_connect_to_provider_to_see_your_posts, { provider_name: selectedProvider.name })}</NotConnectedMessage>);
    }

    return (
        <>
            <SyrfFormWrapper style={{ marginTop: '33px' }}>
                <SyrfFormTitle>{t(translations.profile_page.update_profile.social_profiles_connection)}</SyrfFormTitle>
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
    display: flex;
    align-items: center;
    flex-direction: column;
`;

export const Post = styled.div`
    background: #fff;
    padding: 15px;
    margin-bottom: 15px;
    width: 100%;
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