import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { removeCredential } from 'services/live-data-server/external-platform';

export const DeleteCredentialModal = (props) => {

    const { t } = useTranslation();

    const {
        credential,
        showDeleteModal,
        setShowDeleteModal,
        onCredentialDeleted
    } = props;

    const performDelete = async () => {
        const response = await removeCredential(credential.id);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success(t(translations.delete_credential_modal.successfully_deleted));
            onCredentialDeleted();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal
            title={t(translations.delete_credential_modal.are_you_sure_you_want_to_delete)}
            visible={showDeleteModal}
            onOk={() => {
                performDelete();
            }}
            onCancel={() => {
                setShowDeleteModal(false);
            }}>
            <ModalMessage>{t(translations.delete_credential_modal.you_will_delete)}</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;