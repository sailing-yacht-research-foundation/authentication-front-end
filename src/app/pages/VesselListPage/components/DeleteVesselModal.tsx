import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { deleteVessel } from 'services/live-data-server/vessels';
import { translations } from 'locales/translations';

export const DeleteVesselModal = (props) => {

    const { t } = useTranslation();

    const {
        vessel,
        showDeleteModal,
        setShowDeleteModal,
        onVesselDeleted
    } = props;

    const performDeleteCompetitionUnit = async () => {
        const response = await deleteVessel(vessel.id);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success(t(translations.delete_vessel_modal.successfully_deleted, { name: vessel.publicName }));
            onVesselDeleted();
        } else {
            toast.error(t(translations.delete_vessel_modal.an_unexpected_error));
        }
    }

    return (
        <Modal
            title={t(translations.delete_vessel_modal.are_you_sure_you_want_to_delete)}
            visible={showDeleteModal}
            onOk={() => {
                performDeleteCompetitionUnit();
            }}
            onCancel={() => {
                setShowDeleteModal(false);
            }}>
            <ModalMessage>{t(translations.delete_vessel_modal.you_will_delete)}</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;