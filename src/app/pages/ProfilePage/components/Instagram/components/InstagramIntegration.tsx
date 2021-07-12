import React, { useEffect } from 'react';
import InstagramLogin from 'instagram-login-react';
import { toast } from 'react-toastify';
import {
    InstagramFilled
} from '@ant-design/icons';
import { ConnectButton, ConnectDisconnectButton } from 'app/pages/ProfilePage/components/ProviderConnect';
import { useDispatch, useSelector } from 'react-redux';
import { getUserAttribute } from 'utils/user-utils';
import { selectIsConnected } from '../slice/selectors';
import { useInstagramSlice } from '../slice';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import styled from 'styled-components';

const InstagramIntegration = (props) => {
    const isConnected = useSelector(selectIsConnected);

    const user = useSelector(selectUser);

    const { actions } = useInstagramSlice();

    const dispatch = useDispatch();

    useEffect(() => {
        checkForConnectStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkForConnectStatus = () => {
        const token = getUserAttribute(user, 'custom:ig_token');
        dispatch(actions.setIsConnected(!!token));
    }

    const onInstagramResponded = (code) => {
        if (code)
            // storeInstagramAccessToken(token, 'Successfully linked Instagram to your SYRF account', true);
            dispatch(actions.exchangeTokenFromCode(code));
    }

    // const storeInstagramAccessToken = (instagramAccessToken: string, notificationMessage: string, connectState: boolean) => {
    //     Auth.currentAuthenticatedUser().then(user => {
    //         Auth.updateUserAttributes(user, {
    //             'custom:ig_token': instagramAccessToken
    //         }).then(response => {
    //             toast.success(notificationMessage);
    //             dispatch(actions.setIsConnected(connectState));
    //         }).catch(error => {
    //             toast.error(error.message);
    //         })
    //     }).catch(error => {
    //         toast.error(error.message);
    //     })
    // }

    const onInstagramResponFailed = (data) => {
        toast.error('We have encountered an unexpected error.');
    }

    // const disconnect = () => {
    //     storeInstagramAccessToken('', 'Successfully disconnect Instagram from your SYRF account', false);
    // }

    return (
        <>
            {!isConnected ? (
                <InstagramLogin
                    clientId="478370613251328"
                    buttonText=""
                    onSuccess={onInstagramResponded}
                    onFailure={onInstagramResponFailed}
                    cssClass="instagram-button"
                    redirectUri="https://syrf.dev/profile"
                    scope="user_profile,user_media"
                >
                    <ConnectButton
                        providerTitle="Instagram"
                        connected={isConnected}
                        Color="#3b5998"
                        title="Connect To Instgram"
                        active={props.active}
                        onClick={props.onClick}
                        icon={<StyledInstagramIcon />}
                    >
                        <ConnectDisconnectButton>Not Connected</ConnectDisconnectButton>
                    </ConnectButton>
                </InstagramLogin>
            ) :

                (<ConnectButton
                    providerTitle="Instagram"
                    connected={isConnected}
                    Color="#3b5998"
                    title="Connect To Instgram"
                    active={props.active}
                    // onClick={disconnect}
                    onClick={props.onClick}
                    icon={<StyledInstagramIcon />}
                >
                    <ConnectDisconnectButton>Connected</ConnectDisconnectButton>
                </ConnectButton>)
            }
        </>
    )
}

export default InstagramIntegration;

const StyledInstagramIcon = styled(InstagramFilled)`
    font-size: 30px;
    color: #E8878C;
`;