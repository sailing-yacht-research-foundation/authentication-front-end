import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { deleteGroup } from 'services/live-data-server/groups';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { Group } from 'types/Group';

interface DeleteGroupModal {
    group: Partial<Group>,
    showDeleteModal: boolean,
    setShowDeleteModal: Function,
    onGroupDeleted: Function
}

export const DeleteGroupModal = (props: DeleteGroupModal) => {

    const { t } = useTranslation();

    const {
        group,
        showDeleteModal,
        setShowDeleteModal,
        onGroupDeleted
    } = props;

    const performDeleteCompetitionUnit = async () => {
        const response = await deleteGroup(group.id!);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success(t(translations.delete_vessel_participant_group_modal.successfully_deleted));
            onGroupDeleted();
        } else {
            showToastMessageOnRequestError(response.error);
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