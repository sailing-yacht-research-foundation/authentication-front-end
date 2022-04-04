import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { media } from 'styles/media';
import { StyleConstants } from 'styles/StyleConstants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export const ProfileTabs = (props) => {

    const { t } = useTranslation();

    const location = useLocation();

    const tabs = [
        { path: '/account', name: t(translations.profile_page.update_profile.account_information) },
        { path: '/account/change-password', name: t(translations.profile_page.update_profile.password_security) },
        { path: '/account/integrations', name: t(translations.profile_page.update_profile.integrations) },
        { path: '/account/settings', name: t(translations.profile_page.update_profile.account_settings) },
        { path: '/account/subscription', name: t(translations.profile_page.update_profile.subscription) },
    ];

    return (
        <Tabs>
            {tabs.map(tab => <TabItem className={location.pathname === tab.path ? 'active' : ''} to={tab.path}>{tab.name}</TabItem>)}
        </Tabs>
    )
}

const Tabs = styled.div`
    display: flex;  
    flex-direction: column;
    align-self: flex-start;
    margin-left: 35px;

    ${media.medium`
        font-size: 24px;
        flex-direction: row;
    `}
`;

const TabItem = styled(Link)`
    font-family: Roboto;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 28px;
    letter-spacing: 0em;
    text-align: left;
    color: #000;
    margin-right: 50px;

    ${media.medium`
        font-size: 24px;
    `}

    &.active {
        color: ${StyleConstants.MAIN_TONE_COLOR};
    }
`;