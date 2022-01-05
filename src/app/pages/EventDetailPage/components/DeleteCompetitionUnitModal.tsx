import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { deleteCompetitionUnit } from 'services/live-data-server/competition-units';
import { translations } from 'locales/translations';
import { showToastMessageOnRequestError } from 'utils/helpers';

export const DeleteCompetitionUnitModal = (props) => {

    const { t } = useTranslation();

    const {
        competitionUnit,
        showDeleteModal,
        setShowDeleteModal,
        onCompetitionUnitDeleted
    } = props;

    const performDeleteCompetitionUnit = async () => {
        const response = await deleteCompetitionUnit(competitionUnit.calendarEventId, competitionUnit.id);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success(t(translations.delete_competition_unit_modal.successfully_deleted, { name: competitionUnit.name }));
            onCompetitionUnitDeleted();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal
            title={t(translations.delete_competition_unit_modal.are_you_sure_you_want_to_delete)}
            visible={showDeleteModal}
            onOk={() => {
                performDeleteCompetitionUnit();
            }}
            onCancel={() => {
                setShowDeleteModal(false);
            }}>
            <ModalMessage>{t(translations.delete_competition_unit_modal.you_will_delete)}</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;