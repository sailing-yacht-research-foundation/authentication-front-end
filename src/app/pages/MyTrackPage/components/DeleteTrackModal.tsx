import React from 'react';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { deleteEvent } from 'services/live-data-server/event-calendars';
import { translations } from 'locales/translations';
import { showToastMessageOnRequestError } from 'utils/helpers';

export const DeleteTrackModal = (props) => {

    const { t } = useTranslation();

    const {
        onTrackDeleted,
        track,
        showDeleteModal,
        setShowDeleteModal
    } = props;

    const performDeleteTrack = async () => {
        const response = await deleteEvent(track?.event?.id);

        setShowDeleteModal(false);

        if (response.success) {
            toast.success(t(translations.delete_track_modal.successfully_deleted, { name: track?.event?.name }));
            onTrackDeleted();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal
            title={t(translations.delete_track_modal.are_you_sure_you_want_to_delete)}
            visible={showDeleteModal}
            onOk={() => {
                performDeleteTrack();
            }}
            onCancel={() => {
                setShowDeleteModal(false);
            }}>
            <ModalMessage>{t(translations.delete_track_modal.you_will_delete)}</ModalMessage>
        </Modal>
    )
}

const ModalMessage = styled.div`
    margin: 0 5px;
    margin-bottom: 15px;
`;