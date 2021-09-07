import React from 'react';
import { Modal, Form } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { deleteRace } from 'services/live-data-server/event-calendars';

export const DeleteRaceModal = (props) => {

    const { t } = useTranslation();

    const { onRaceDeleted } = props;

    const {
        race,
        showDeleteModal,
        setShowDeleteModal
    } = props;

    const performDeleteRace = async () => {
        const response = await deleteRace(race.id);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success('Successfully deleted ' +  race.name);
            onRaceDeleted();
        } else {
            toast.error('An unexpected error happened when deleting your race');
        }
    }

    return (
        <Modal
            title={'Are you sure you want to delete this race?'}
            visible={showDeleteModal}
            onOk={() => {
                performDeleteRace();
            }}
            onCancel={() => {
                setShowDeleteModal(false);
            }}>
            <ModalMessage>You will delete this race along with all associated information, are you sure you want to continue?</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;