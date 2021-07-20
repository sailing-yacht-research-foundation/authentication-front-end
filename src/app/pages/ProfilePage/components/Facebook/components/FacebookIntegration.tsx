import React from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { ConnectButton, ConnectDisconnectButton } from 'app/pages/ProfilePage/components/ProviderConnect';
import { toast } from 'react-toastify';
import {
    FacebookOutlined
} from '@ant-design/icons';
import { useEffect } from 'react';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAttribute } from 'utils/user-utils';
import { facebookActions, useFacebookSlice } from '../slice';
import { selectIsConnected } from '../slice/selectors';

const FacebookIntegration = (props) => {
    const isConnected = useSelector(selectIsConnected);

    const user = useSelector(selectUser);

    const { actions } = useFacebookSlice();

    const dispatch = useDispatch();

    useEffect(() => {
        checkForConnectStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkForConnectStatus = () => {
        const token = getUserAttribute(user, 'custom:fb_token');
        const connectStatus = !!token;

        dispatch(actions.setIsConnected(connectStatus));
    }

    const onFacebookResponded = (response) => {
        if (response && response.accessToken)
            dispatch(facebookActions.exchangeToken(response.accessToken));
        else toast.error('We have encountered an unexpected error.');
    }

    return (
        <>
            {!isConnected ? (
                <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
                    fields="name,email,picture"
                    scope="user_posts"
                    callback={onFacebookResponded}
                    cssClass="connect-btn"
                    render={rednerProps => (
                        <ConnectButton
                            providerTitle="Facebook"
                            connected={isConnected}
                            Color="#3b5998"
                            title="Connect To Facebook"
                            active={props.active}
                            onClick={rednerProps.onClick}
                            icon={<FacebookOutlined size={25} twoToneColor="#eb2f96" color="#3b5998" style={{ color: '#3B5998', fontSize: '30px' }} />}
                        >
                            <ConnectDisconnectButton>Not Connected</ConnectDisconnectButton>
                        </ConnectButton>
                    )}
                />
            ) :
                <ConnectButton
                    providerTitle="Facebook"
                    connected={isConnected}
                    Color="#3b5998"
                    title="Connect To Facebook"
                    active={props.active}
                    onClick={props.onClick}
                    icon={<FacebookOutlined size={25} twoToneColor="#eb2f96" color="#3b5998" style={{ color: '#3B5998', fontSize: '30px' }} />}
                >
                    <ConnectDisconnectButton>Connected</ConnectDisconnectButton>
                </ConnectButton>
            }
        </>
    )
}

export default FacebookIntegration;