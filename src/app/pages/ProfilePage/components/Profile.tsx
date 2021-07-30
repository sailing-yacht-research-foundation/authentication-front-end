import React from 'react';
import styled from 'styled-components';
import Auth from '@aws-amplify/auth';
import { UpdateInfo } from './UpdateInfoForm';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { loginActions } from 'app/pages/LoginPage/slice';
import { ProfileTabs } from './ProfileTabs';
import { LinkToProviders } from './LinkToProviders';
import { DeleteUserModal } from './DeleteUserModal';
import { SyrfButtonDescription, SyrfButtonTitle, SyrfFormTitle, SyrfFormWrapper } from 'app/components/SyrfForm';
import { Row, Col, Button } from 'antd';

export const Profile = () => {

    const [showDeleteUserModal, setShowDeleteUserModal] = React.useState<boolean>(false);

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
            <DeleteUserModal
                showDeleteUserModal={showDeleteUserModal}
                setShowDeleteUserModal={setShowDeleteUserModal}
                authUser={authUser}
            />
            <ProfileTabs />
            <UpdateInfo cancelUpdateProfile={cancelUpdateProfile} authUser={authUser} />
            <LinkToProviders />
            <SyrfFormWrapper className="danger-zone">
                <SyrfFormTitle>Danger Zone</SyrfFormTitle>
                <Row gutter={24}>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <SyrfButtonTitle>Delete My account</SyrfButtonTitle>
                        <SyrfButtonDescription>You will delete your account along with all information</SyrfButtonDescription>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <DeleteAccountButtonWrapper>
                            <Button danger onClick={() => setShowDeleteUserModal(true)}>
                                Permantly delete my account
                            </Button>
                        </DeleteAccountButtonWrapper>
                    </Col>
                </Row>
            </SyrfFormWrapper>
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

const DeleteAccountButtonWrapper = styled.div`
    text-align: center;

    > a { color: red; }
`;