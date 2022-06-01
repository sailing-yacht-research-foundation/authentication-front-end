import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { deleteVessel } from 'services/live-data-server/vessels';
import { translations } from 'locales/translations';
import { showToastMessageOnRequestError } from 'utils/helpers';

export const DeleteVesselModal = (props) => {

    const { t } = useTranslation();

    const {
        vessel,
        showDeleteModal,
        setShowDeleteModal,
        onVesselDeleted
    } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const performDeleteCompetitionUnit = async () => {
        setIsLoading(true);
        const response = await deleteVessel(vessel.id);
        setIsLoading(false);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success(t(translations.delete_vessel_modal.successfully_deleted, { name: vessel.publicName }));
            onVesselDeleted();
        } else {
            if (response.error?.response.status === 401) {
                toast.error(t(translations.general.your_action_is_unauthorized));
            } else {
                showToastMessageOnRequestError(response.error);
            }
        }
    }

    if (!vessel.isDefaultVessel)
        return (
            <Modal
                confirmLoading={isLoading}
                title={t(translations.delete_vessel_modal.are_you_sure_you_want_to_delete)}
                visible={showDeleteModal}
                onOk={performDeleteCompetitionUnit}
                onCancel={() => {
                    setShowDeleteModal(false);
                }}>
                <ModalMessage>{t(translations.delete_vessel_modal.you_will_delete)}</ModalMessage>
            </Modal>
        );

    return (<Modal
        title={t(translations.delete_vessel_modal.cannot_delete_default_boat)}
        visible={showDeleteModal}
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => {
            setShowDeleteModal(false);
        }}
        onCancel={() => {
            setShowDeleteModal(false);
        }}>
        <ModalMessage>{t(translations.delete_vessel_modal.you_cannot_not_delete_your_default_boat)}</ModalMessage>
    </Modal>);
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;