import React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { getUserAttribute } from 'utils/user-utils';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export const DeleteUserModal = (props) => {

    const { showDeleteUserModal, setShowDeleteUserModal, authUser } = props;

    const dispatch = useDispatch();

    const history = useHistory();

    const loginActions = UseLoginSlice().actions;

    const { t } = useTranslation();

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
        toast.info(t(translations.profile_page.update_profile.we_hope_to_see_you_again));
        localStorage.removeItem('access_token');
    }

    return (
        <Modal
            visible={showDeleteUserModal}
            onCancel={() => setShowDeleteUserModal(false)}
            onOk={deleteUser}
            title={t(translations.profile_page.update_profile.are_you_really_sure_you_want_to_delete_your_account)}>
            <DeleteWarningMessageText>
                {t(translations.profile_page.update_profile.hey_your_going_to_delete_your_account, { name: getUserAttribute(authUser, 'name') })}
            </DeleteWarningMessageText>
        </Modal>
    );
}

const DeleteWarningMessageText = styled.div``;