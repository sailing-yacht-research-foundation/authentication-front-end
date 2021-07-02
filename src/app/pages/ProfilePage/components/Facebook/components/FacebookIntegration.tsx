import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { ConnectButton, ConnectDisconnectButton } from 'app/pages/ProfilePage/components/ProviderConnect';
import Auth from '@aws-amplify/auth';
import { toast } from 'react-toastify';
import {
    FacebookOutlined
} from '@ant-design/icons';
import { useEffect } from 'react';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAttribute } from 'utils/user-utils';
import { useFacebookSlice } from '../slice';
import { selectIsConnected } from '../slice/selectors';

const FacebookIntegration = (props) => {
    const isConnected = useSelector(selectIsConnected);

    const user = useSelector(selectUser);

    const { actions } = useFacebookSlice();

    const dispatch = useDispatch();

    useEffect(() => {
        checkForConnectStatus();
    }, []);

    const checkForConnectStatus = () => {
        const token = getUserAttribute(user, 'custom:fb_token');
        const connectStatus = !!token;

        dispatch(actions.setIsConnected(connectStatus));
    }

    const onFacebookResponded = (response) => {
        if (response && response.accessToken)
            storeFacebookAccessToken(response.accessToken, 'Successfully linked Facebook to your SYRF account', true);
        else toast.error('We have encountered an unexpected error.');
    }

    const storeFacebookAccessToken = (facebookAccessToken: string, notificationMessage: string, connectState: boolean) => {
        console.log(facebookAccessToken);
        Auth.currentAuthenticatedUser().then(user => {
            Auth.updateUserAttributes(user, {
                'custom:fb_token': facebookAccessToken
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

    const disconnect = () => {
        storeFacebookAccessToken('', 'Successfully disconnect Facebook from your SYRF account', false);
    }

    return (
        <ConnectButton
            providerTitle="Facebook"
            connected={isConnected}
            Color="#3b5998"
            title="Connect To Facebook"
            active={props.active}
            onClick={props.onClick}
            icon={<FacebookOutlined size={25} twoToneColor="#eb2f96" color="#3b5998" style={{ color: '#3B5998', fontSize: '30px' }} />}
        >
            {!isConnected ? (
                <FacebookLogin
                    appId="4037107746377946"
                    fields="name,email,picture"
                    scope="user_posts"
                    callback={onFacebookResponded}
                    cssClass="connect-btn"
                    render={rednerProps => (
                        <ConnectDisconnectButton onClick={rednerProps.onClick}>Not Connected</ConnectDisconnectButton>
                    )}
                />
            ) : 
            <></>
            // <ConnectDisconnectButton onClick={disconnect}>Disconnect</ConnectDisconnectButton>
            }
        </ConnectButton>
    )
}

export default FacebookIntegration;