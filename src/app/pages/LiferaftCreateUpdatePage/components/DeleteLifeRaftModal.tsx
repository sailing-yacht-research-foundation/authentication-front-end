import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { deleteLiferaft } from 'services/live-data-server/liferafts';

export const DeleteLiferaftModal = (props) => {

    const { t } = useTranslation();

    const {
        liferaft,
        showDeleteModal,
        setShowDeleteModal,
        onLiferaftDeleted
    } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const performDeleteLiferaft = async () => {
        setIsLoading(true);
        const response = await deleteLiferaft(liferaft.id);
        setIsLoading(false);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success(t(translations.delete_liferaft_modal.deleted_successfully));
            onLiferaftDeleted();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal
            title={t(translations.delete_liferaft_modal.are_you_sure_you_want_to_delete_this_liferaft)}
            visible={showDeleteModal}
            confirmLoading={isLoading}
            onOk={() => {
                performDeleteLiferaft();
            }}
            onCancel={() => {
                setShowDeleteModal(false);
            }}>
            <ModalMessage>{t(translations.delete_liferaft_modal.all_information_associated_with_this_liferaft_will_be_deleted)}</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;