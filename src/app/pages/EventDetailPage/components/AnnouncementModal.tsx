import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { Modal, Spin, Form, Select, Radio } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfTextArea } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { Participant } from 'types/Participant';
import { getAcceptedParticipantByCalendarEventId } from 'services/live-data-server/participants';
import { CalendarEvent } from 'types/CalendarEvent';

const radioValue = {
    SEND_TO_ALL: 1,
    SEND_TO_SOME: 2,
}

export const AnnouncementModal = ({ event, showModal, setShowModal }: { event: Partial<CalendarEvent>, showModal: boolean, setShowModal: Function }) => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [participants, setParticipants] = React.useState<Participant[]>([]);

    const [selectedRadioValue, setSelectedRadioValue] = React.useState<number>(radioValue.SEND_TO_ALL);

    const [form] = useForm();

    const { t } = useTranslation();

    const onFinish = async (values) => {
        const form = new FormData();
        let response;
        const { file, trackName, vesselId, vesselName } = values;


        setIsLoading(true);
        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.general.your_action_is_successful));
            hideModal();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const hideModal = () => {
        setShowModal(false);
        form.resetFields();
    }

    const getAllEventParticipants = async () => {

        const response = await getAcceptedParticipantByCalendarEventId(event.id!, 1, 1000);

        if (response.success) {
            setParticipants(response.data?.rows);
            if (response.data?.count > 0) {
                form.setFieldsValue({
                    participants: [response.data?.rows[0]?.id]
                });
            }
        }
    }

    const renderParticipantsList = () => {
        return participants.map(item => <Select.Option value={item.id}>{item.publicName}</Select.Option>)
    }

    React.useEffect(() => {
        if (event.id)
            getAllEventParticipants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [event]);

    const onRadioChanged = (e) => {
        setSelectedRadioValue(e.target.value);
    }

    const renderFormFieldsBaseOnRadioValue = () => {
        switch (selectedRadioValue) {
            case radioValue.SEND_TO_ALL:
                return <></>;
            case radioValue.SEND_TO_SOME:
                return <Form.Item
                    label={<SyrfFieldLabel>{t(translations.event_detail_page.select_competitors)}</SyrfFieldLabel>}
                    name="participantIds"
                    rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }]}
                >
                    <SyrfFormSelect>
                        {renderParticipantsList()}
                    </SyrfFormSelect>
                </Form.Item>
        }
    }

    return (
        <Modal
            title={t(translations.event_detail_page.send_announcement)}
            bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}
            visible={showModal}
            footer={null}
            onCancel={hideModal}
        >
            <Spin spinning={isLoading}>
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    onFinish={onFinish}
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.event_detail_page.message)}</SyrfFieldLabel>}
                        name="message"
                        rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }, {
                            max: 5000, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 5000 })
                        }]}
                    >
                        <SyrfTextArea />
                    </Form.Item>

                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.event_detail_page.participants)}</SyrfFieldLabel>}
                    >
                        <Radio.Group onChange={onRadioChanged} value={selectedRadioValue}>
                            <Radio value={radioValue.SEND_TO_ALL}>{t(translations.event_detail_page.send_to_all_competitors)}</Radio>
                            <Radio value={radioValue.SEND_TO_SOME}>{t(translations.event_detail_page.send_to_some_of_the_competitors)}</Radio>                        </Radio.Group>
                    </Form.Item>

                    {renderFormFieldsBaseOnRadioValue()}

                    <SyrfFormButton type="primary" htmlType="submit">
                        {t(translations.event_detail_page.send_announcement)}
                    </SyrfFormButton>
                </Form>
            </Spin>
        </Modal>
    );
}