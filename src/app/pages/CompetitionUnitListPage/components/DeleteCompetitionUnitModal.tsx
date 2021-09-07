import React from 'react';
import { Modal, Form } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { deleteCompetitionUnit } from 'services/live-data-server/competition-units';

export const DeleteCompetitionUnitModal = (props) => {

    const { t } = useTranslation();

    const {
        competitionUnit,
        showDeleteModal,
        setShowDeleteModal,
        onCompetitionUnitDeleted
    } = props;

    const performDeleteRace = async () => {
        const response = await deleteCompetitionUnit(competitionUnit.calendarEventId, competitionUnit.id);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success('Successfully deleted ' +  competitionUnit.name);
            onCompetitionUnitDeleted();
        } else {
            toast.error('An unexpected error happened when deleting your competition unit');
        }
    }

    return (
        <Modal
            title={'Are you sure you want to delete this competition unit?'}
            visible={showDeleteModal}
            onOk={() => {
                performDeleteRace();
            }}
            onCancel={() => {
                setShowDeleteModal(false);
            }}>
            <ModalMessage>You will delete this competition unit along with all associated information, are you sure you want to continue?</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;