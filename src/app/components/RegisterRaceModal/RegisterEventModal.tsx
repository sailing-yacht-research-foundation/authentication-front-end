import React from 'react';
import { Modal, Form, } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { joinEvent } from 'services/live-data-server/event-calendars';
import { FormContent } from './FormContent';
import { CalendarEvent } from 'types/CalendarEvent';

interface IRegisterEventModal {
    showModal: boolean
    setShowModal: Function,
    event: Partial<CalendarEvent>,
    reloadParent: Function
}

export const RegisterEventModal = ({ showModal, setShowModal, event, reloadParent }: IRegisterEventModal) => {

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [form] = Form.useForm();

    const hideModal = () => {
        setShowModal(false);
    }

    const onFinish = async (values) => {
        const { vesselId, allowShareInformation, sailNumber } = values;

        setIsLoading(true);
        const response = await joinEvent(event.id!, vesselId, sailNumber, allowShareInformation);
        setIsLoading(false);

        if (response.success) {
            hideModal();
            reloadParent();
            toast.success(t(translations.general.your_action_is_successful));
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (<Modal
        title={t(translations.my_event_list_page.register_for, { name: event.name })}
        bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}
        visible={showModal}
        footer={null}
        onCancel={hideModal}
    >
        <FormContent eventId={event.id} form={form} isLoading={isLoading} onFinish={onFinish} setShowModal={setShowModal} showModal={setShowModal} t={t} />
    </Modal >);
}
