import React, { useEffect } from 'react';
import InstagramLogin from 'instagram-login-react';
import { ConnectButton } from 'app/components/ConnectButton';
import Auth from '@aws-amplify/auth';
import { toast } from 'react-toastify';
import {
    InstagramFilled
} from '@ant-design/icons';
// import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAttribute } from 'utils/user-utils';
import { selectIsConnected } from '../slice/selectors';
import { useInstagramSlice } from '../slice';

const InstagramIntegration = (props) => {
    const isConnected = useSelector(selectIsConnected);

    const user = false;

    const { actions } = useInstagramSlice();

    const dispatch = useDispatch();

    useEffect(() => {
        checkForConnectStatus();
    });

    const checkForConnectStatus = () => {
        const token = getUserAttribute(user, 'custom:ig_token');
        dispatch(actions.setIsConnected(!!token));
    }

    // const onComponentClicked = (data) => {
    //     console.log(data);
    // }

    const onInstagramResponded = (token) => {
        console.log(token);
        if (token)
            storeInstagramAccessToken(token);
    }

    const storeInstagramAccessToken = (instagramAccessToken: string) => {
        Auth.currentAuthenticatedUser().then(user => {
            Auth.updateUserAttributes(user, {
                'custom:ig_token': instagramAccessToken
            }).then(response => {
                toast.success('Successfully linked Instagram to your SYRF account');
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

    const renderConnectButton = (connected) => {
        return (
            <ConnectButton connected={connected} bgColor="rgba(0, 0, 0, 0) linear-gradient(to right, rgb(236, 146, 35) 0%, rgb(177, 42, 160) 50%, rgb(105, 14, 224) 100%) repeat scroll 0% 0%" title="Connect To Instagram">
                <InstagramFilled size={25} twoToneColor="#eb2f96" color="#3b5998" style={{ color: '#fff', fontSize: '20px' }} />
            </ConnectButton>
        )
    }

    return (
        <>
            {
                !isConnected ? (
                    <InstagramLogin
                        clientId="478370613251328"
                        buttonText="Login"
                        onSuccess={onInstagramResponded}
                        onFailure={onInstagramResponFailed}
                        cssClass="instagram-button"
                        redirectUri="https://syrf.dev/profile"
                        scope="user_profile,user_media"
                    >
                        {renderConnectButton(false)}
                    </InstagramLogin>
                ) : (
                    renderConnectButton(true)
                )
            }
        </>
    )
}

export default InstagramIntegration;