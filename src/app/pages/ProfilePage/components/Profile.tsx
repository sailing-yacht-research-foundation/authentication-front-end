import React from 'react';
import styled from 'styled-components';
import Auth from '@aws-amplify/auth';
import { UpdateInfo } from './UpdateInfoForm';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { loginActions } from 'app/pages/LoginPage/slice';
import { ProfileTabs } from './ProfileTabs';
// import { LinkToProviders } from './LinkToProviders';

export const Profile = () => {
    const authUser = useSelector(selectUser);

    const dispatch = useDispatch();

    const cancelUpdateProfile = () => {
        getAuthorizedAuthUser();
    }

    const getAuthorizedAuthUser = () => {
        Auth.currentAuthenticatedUser()
            .then(user => dispatch(loginActions.setUser(JSON.parse(JSON.stringify(user)))))
            .catch(error => { });
    }

    return (
        <Wrapper>
            <ProfileTabs />
            <UpdateInfo cancelUpdateProfile={cancelUpdateProfile} authUser={authUser} />
            {/* <LinkToProviders /> Hide & comment this base on Jon's request of SNS-250 */}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 132px;
    align-items: center;
    width: 100%;
    position: relative;
    padding-bottom: 50px;
`;