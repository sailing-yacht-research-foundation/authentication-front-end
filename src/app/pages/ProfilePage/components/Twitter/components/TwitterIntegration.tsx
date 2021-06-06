import { ConnectButton } from 'app/components/ConnectButton';
import React from 'react';
import TwitterLogin from "react-twitter-login";
import {
    TwitterCircleFilled
} from '@ant-design/icons';

const TwitterIntegration = () => {

    const onTwitterCallback = (response) => {
        console.log(response);
    }

    return (
        <>
            <TwitterLogin
                authCallback={onTwitterCallback}
                consumerKey={'key'}
                className="connect-btn"
                consumerSecret={'key'}
            />
            <ConnectButton bgColor="#00ACEE" title="Connect to Twitter">
                <TwitterCircleFilled style={{ color: '#fff', fontSize:'25px' }}/>
            </ConnectButton>
        </>
    );
}

export default TwitterIntegration