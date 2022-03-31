import React from 'react';
import { Modal } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { stopEvent } from 'services/live-data-server/event-calendars';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { CalendarEvent } from 'types/CalendarEvent';

interface IConfirmStopEventModal {
    showModal: boolean,
    setShowModal: Function,
    event: CalendarEvent,
    reloadParent: Function
}

export const ConfirmStopEventModal = (props: IConfirmStopEventModal) => {

    const { showModal, setShowModal, event, reloadParent } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const stopTheEvent = async () => {
        setIsLoading(true);
        const response = await stopEvent(event.id!);
        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.my_event_create_update_page.successfully_stopped_this_event));
            setShowModal(false);
            reloadParent();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal confirmLoading={isLoading} visible={showModal} onOk={stopTheEvent} onCancel={() => setShowModal(false)} title={t(translations.my_event_create_update_page.stop_this_event)}>
            <span>{t(translations.my_event_create_update_page.are_you_sure_you_want_to_stop_this_event)}</span>
        </Modal>
    )
}