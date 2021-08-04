import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { media } from 'styles/media';
import { StyleConstants } from 'styles/StyleConstants';

export const ProfileTabs = (props) => {

    return (
        <Tabs>
            <TabItem className="active" to="/profile">Account settings</TabItem>
            <TabItem to="/profile/change-password">Password & Security</TabItem>
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