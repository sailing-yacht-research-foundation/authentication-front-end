import React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { deleteUserAccount } from 'services/live-data-server/user';

export const DeleteUserModal = (props) => {

    const { showDeleteUserModal, setShowDeleteUserModal, authUser } = props;

    const dispatch = useDispatch();

    const history = useHistory();

    const loginActions = UseLoginSlice().actions;

    const { t } = useTranslation();

    const deleteUser = async () => {
        const response = await deleteUserAccount();

        if (response.success) {
            onUserDeleted();
        } else {
            toast.error(t(translations.profile_page.error_encounted_when_delete_account));
        }
    }

    const onUserDeleted = () => {
        dispatch(loginActions.setLogout());
        history.push('/signin');
        toast.info(t(translations.profile_page.update_profile.we_hope_to_see_you_again));
        localStorage.removeItem('session_token');
    }

    return (
        <Modal
            visible={showDeleteUserModal}
            onCancel={() => setShowDeleteUserModal(false)}
            onOk={deleteUser}
            title={t(translations.profile_page.update_profile.are_you_really_sure_you_want_to_delete_your_account)}>
            <DeleteWarningMessageText>
                {t(translations.profile_page.update_profile.hey_your_going_to_delete_your_account, { name: authUser.firstName + ' ' + authUser.lastName })}
            </DeleteWarningMessageText>
        </Modal>
    );
}

const DeleteWarningMessageText = styled.div``;