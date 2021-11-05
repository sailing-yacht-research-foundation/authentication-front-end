import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { deleteGroup } from 'services/live-data-server/groups';

export const DeleteGroupModal = (props) => {

    const { t } = useTranslation();

    const {
        group,
        showDeleteModal,
        setShowDeleteModal,
        onGroupDeleted
    } = props;

    const performDeleteCompetitionUnit = async () => {
        const response = await deleteGroup(group.id);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success(t(translations.delete_vessel_participant_group_modal.successfully_deleted));
            onGroupDeleted();
        } else {
            toast.error(t(translations.delete_vessel_participant_group_modal.an_unexpected_error));
        }
    }

    return (
        <Modal
            title={t(translations.delete_vessel_participant_group_modal.are_you_sure_you_want_to_delete)}
            visible={showDeleteModal}
            onOk={() => {
                performDeleteCompetitionUnit();
            }}
            onCancel={() => {
                setShowDeleteModal(false);
            }}>
            <ModalMessage>{t(translations.delete_vessel_participant_group_modal.you_will_delete)}</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;