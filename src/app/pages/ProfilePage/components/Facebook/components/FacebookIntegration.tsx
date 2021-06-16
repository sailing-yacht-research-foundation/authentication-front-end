import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { ConnectButton } from 'app/components/ConnectButton';
import Auth from '@aws-amplify/auth';
import { toast } from 'react-toastify';
import {
    FacebookFilled
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

    const onComponentClicked = (data) => {
        console.log(data);
    }

    const onFacebookResponded = (response) => {
        if (response && response.accessToken)
            storeFacebookAccessToken(response.accessToken);
        else toast.error('We have encountered an unexpected error.');
    }

    const storeFacebookAccessToken = (facebookAccessToken: string) => {
        Auth.currentAuthenticatedUser().then(user => {
            Auth.updateUserAttributes(user, {
                'custom:fb_token': facebookAccessToken
            }).then(response => {
                toast.success('Successfully linked Facebook to your SYRF account');
            }).catch(error => {
                toast.error(error.message);
            })
        }).catch(error => {
            toast.error(error.message);
        })
    }

    return (
        <FacebookLogin
            appId="4037107746377946"
            fields="name,email,picture"
            scope="user_posts"
            callback={onFacebookResponded}
            cssClass="connect-btn"
            render={rednerProps => (
                <ConnectButton connected={ isConnected } onClick={rednerProps.onClick} bgColor="#3b5998" title="Connect To Facebook">
                    <FacebookFilled size={25} twoToneColor="#eb2f96" color="#3b5998" style={{ color: '#fff', fontSize: '20px' }} />
                </ConnectButton>
            )}
        />
    )
}

export default FacebookIntegration;