import React, { useEffect } from 'react';
import InstagramLogin from 'instagram-login-react';
import { ConnectButton, ConnectDisconnectButton } from 'app/pages/ProfilePage/components/ProviderConnect';
import Auth from '@aws-amplify/auth';
import { toast } from 'react-toastify';
import {
    InstagramFilled
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAttribute } from 'utils/user-utils';
import { selectIsConnected } from '../slice/selectors';
import { useInstagramSlice } from '../slice';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';

const InstagramIntegration = (props) => {
    const isConnected = useSelector(selectIsConnected);

    const user = useSelector(selectUser);

    const { actions } = useInstagramSlice();

    const dispatch = useDispatch();

    useEffect(() => {
        checkForConnectStatus();
    }, []);

    const checkForConnectStatus = () => {
        const token = getUserAttribute(user, 'custom:ig_token');
        dispatch(actions.setIsConnected(!!token));
    }

    const onInstagramResponded = (token) => {
        if (token)
            storeInstagramAccessToken(token, 'Successfully linked Instagram to your SYRF account', true);
    }

    const storeInstagramAccessToken = (instagramAccessToken: string, notificationMessage: string, connectState: boolean) => {
        Auth.currentAuthenticatedUser().then(user => {
            Auth.updateUserAttributes(user, {
                'custom:ig_token': instagramAccessToken
            }).then(response => {
                toast.success(notificationMessage);
                dispatch(actions.setIsConnected(connectState));
            }).catch(error => {
                toast.error(error.message);
            })
        }).catch(error => {
            toast.error(error.message);
        })
    }

    const onInstagramResponFailed = (data) => {
        toast.error('We have encountered an unexpected error.');
    }

    const disconnect = () => {
        storeInstagramAccessToken('', 'Successfully disconnect Instagram from your SYRF account', false);
    }

    return (
        <ConnectButton
            providerTitle="Instagram"
            connected={isConnected}
            Color="#3b5998"
            title="Connect To Instgram"
            icon={<InstagramFilled size={25} style={{
                marginTop: '20px', fontSize: '30px', background: '-webkit-linear-gradient(#eee, #333)',
                backgroundClip: 'text'
            }} />}
        >
            {!isConnected ? <InstagramLogin
                clientId="478370613251328"
                buttonText=""
                onSuccess={onInstagramResponded}
                onFailure={onInstagramResponFailed}
                cssClass="instagram-button"
                redirectUri="https://syrf.dev/profile"
                scope="user_profile,user_media"
            >
                <ConnectDisconnectButton>Connect</ConnectDisconnectButton>
            </InstagramLogin> : <ConnectDisconnectButton onClick={disconnect}>Disconnect</ConnectDisconnectButton>}
        </ConnectButton>
    )
}

export default InstagramIntegration;