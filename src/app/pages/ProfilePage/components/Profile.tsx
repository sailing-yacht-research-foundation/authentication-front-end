import React, { useState } from 'react';
import { ChangeAvatar } from './ChangeAvatar';
import { ShowInfoView } from './ShowInfoView';
import { LinkToProviders } from './LinkToProviders';
import styled from 'styled-components';
import Auth from '@aws-amplify/auth';
import { Button } from 'antd';
import {
    EditOutlined
} from '@ant-design/icons';
import { UpdateInfo } from './UpdateInfoForm';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { loginActions } from 'app/pages/LoginPage/slice';
// import FacebookPosts from './Facebook/components/FacebookPosts';
// import InstagramPosts from './Instagram/components/InstagramPost';

export const Profile = () => {
    const authUser = useSelector(selectUser);

    const [isUpdatingProfile, setIsUpdatingProfile] = useState<boolean>(false);

    const dispatch = useDispatch();

    const cancelUpdateProfile = () => {
        setIsUpdatingProfile(false);
        getAuthorizedAuthUser();
    }

    const getAuthorizedAuthUser = () => {
        Auth.currentAuthenticatedUser()
            .then(user => dispatch(loginActions.setUser(JSON.parse(JSON.stringify(user)))))
            .catch(error => { });
    }

    return (
        <Wrapper>
            <ChangeAvatar cancelUpdateProfile={cancelUpdateProfile} authUser={authUser} />
            {!isUpdatingProfile ?
                <>
                    <Button onClick={() => setIsUpdatingProfile(true)} style={{ alignSelf: 'flex-end', marginTop: '50px' }}><EditOutlined /> Update Profile</Button>
                    <ShowInfoView authUser={authUser} />
                    <LinkToProviders/>
                </> :
                <UpdateInfo cancelUpdateProfile={cancelUpdateProfile} authUser={authUser} />
            }
            {/* <FacebookPosts/> */}
            {/* <InstagramPosts/> */}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 150px;
    align-items: center;
    width: 100%;
`