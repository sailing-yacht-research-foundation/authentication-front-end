import React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { getUserAttribute } from 'utils/user-utils';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import { toast } from 'react-toastify';

export const DeleteUserModal = (props) => {

    const { showDeleteUserModal, setShowDeleteUserModal, authUser } = props;

    const dispatch = useDispatch();

    const history = useHistory();

    const loginActions = UseLoginSlice().actions;

    const deleteUser = () => {
        Auth
            .currentAuthenticatedUser()
            .then(user => {
                user.deleteUser(error => {
                    if (error) {
                        toast.error(error.message);
                    }
                    else {
                        onUserDeleted();
                    }
                });
            }).catch(error => {
                toast.error(error.message);
            });
    }

    const onUserDeleted = () => {
        dispatch(loginActions.setLogout());
        history.push('/signin');
        Auth.signOut();
        toast.info('We hope to see you again!');
        localStorage.removeItem('access_token');
    }

    return (
        <Modal
            visible={showDeleteUserModal}
            onOk={() => setShowDeleteUserModal(false)}
            okText={'Cancel'}
            cancelText={'Yes'}
            onCancel={deleteUser}
            title="Are you really sure you want to delete your account?">
            <DeleteWarningMessageText>
                Hey {getUserAttribute(authUser, 'name')}, You're going to delete your account and all information.
                Your information will be lost and cannot be recovered. Are you sure you want to continue?
            </DeleteWarningMessageText>
        </Modal>
    );
}

const DeleteWarningMessageText = styled.div``;