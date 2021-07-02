import React from 'react';
import TwitterLogin from "react-twitter-login";
import {
    TwitterCircleFilled
} from '@ant-design/icons';
import { ConnectButton, ConnectDisconnectButton } from 'app/pages/ProfilePage/components/ProviderConnect';

const TwitterIntegration = (props) => {

    const onTwitterCallback = (response) => {
        console.log(response);
    }

    return (
        <ConnectButton
            bgColor="#00ACEE"
            providerTitle="Twitter"
            title="Connect to Twitter"
            connected={false}
            active={props.active}
            onClick={props.onClick}
            icon={<TwitterCircleFilled style={{ color: '#00aece', fontSize: '30px' }} />}>
            <TwitterLogin
                authCallback={onTwitterCallback}
                consumerKey={'key'}
                className="connect-btn"
                consumerSecret={'key'}

            >
            </TwitterLogin>
            <ConnectDisconnectButton>Not connected</ConnectDisconnectButton>
        </ConnectButton>
    );
}

export default TwitterIntegration