import React from 'react';
import { Modal } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { scheduleCalendarEvent } from 'services/live-data-server/event-calendars';
import { EventState } from 'utils/constants';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';


export const ConfirmPublishEventModal = (props) => {

    const { showModal, setShowModal, event, setEvent } = props;

    const { t } = useTranslation();

    const publishEvent = async () => {
        const response = await scheduleCalendarEvent(event.id);

        if (response.success) {
            toast.success(t(translations.my_event_create_update_page.successfully_scheduled_this_event));
            setEvent({
                ...event,
                status: EventState.SCHEDULED
            });
            setShowModal(false);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal visible={showModal} onOk={publishEvent} onCancel={() => setShowModal(false)} title={t(translations.my_event_create_update_page.publish_this_event)}>
            <span>{t(translations.my_event_create_update_page.once_you_publish_this_event_you)}</span>
        </Modal>
    )
}