import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { deleteEvent } from 'services/live-data-server/event-calendars';
import { translations } from 'locales/translations';
import { showToastMessageOnRequestError } from 'utils/helpers';

export const DeleteEventModal = (props) => {

    const { t } = useTranslation();

    const { onRaceDeleted } = props;

    const {
        event,
        showDeleteModal,
        setShowDeleteModal
    } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const performDeleteRace = async () => {
        setIsLoading(true);
        const response = await deleteEvent(event.id);
        setIsLoading(false);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success(t(translations.delete_event_modal.successfully_deleted, { name: event.name }));
            onRaceDeleted();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal
            confirmLoading={isLoading}
            title={t(translations.delete_event_modal.are_you_sure_you_want_to_delete)}
            visible={showDeleteModal}
            onOk={() => {
                performDeleteRace();
            }}
            onCancel={() => {
                setShowDeleteModal(false);
            }}>
            <ModalMessage>{t(translations.delete_event_modal.you_will_delete)}</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;