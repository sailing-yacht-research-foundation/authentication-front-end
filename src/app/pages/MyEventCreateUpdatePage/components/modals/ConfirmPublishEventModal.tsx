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

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const publishEvent = async () => {
        setIsLoading(true);
        const response = await scheduleCalendarEvent(event.id);
        setIsLoading(false);

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
        <Modal
            confirmLoading={isLoading}
            okText={t(translations.my_event_create_update_page.make_public)}
            cancelText={t(translations.my_event_create_update_page.keep_draft)}
            visible={showModal}
            onOk={publishEvent}
            onCancel={() => setShowModal(false)}
            title={t(translations.my_event_create_update_page.publish_this_event)}>
            <span>{t(translations.my_event_create_update_page.once_you_publish_this_event_you)}</span>
        </Modal>
    )
}