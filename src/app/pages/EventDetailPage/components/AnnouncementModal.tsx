import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { navigateToProfile, showToastMessageOnRequestError } from 'utils/helpers';
import { Modal, Spin, Form, Select, Radio } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfTextArea } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { Participant } from 'types/Participant';
import { getAcceptedAndSelfRegisteredParticipantByCalendarEventId } from 'services/live-data-server/participants';
import { CalendarEvent } from 'types/CalendarEvent';
import { sendMessageToVesselParticipants } from 'services/live-data-server/event-calendars';
import { ItemAvatar } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router-dom';
import { renderAvatar } from 'utils/user-utils';

const radioValue = {
    SEND_TO_ALL: 1,
    SEND_TO_SOME: 2,
}

interface IAnnouncementModal {
    event: Partial<CalendarEvent>,
    showModal: boolean,
    setShowModal: Function,
    reloadParent: Function
}

export const AnnouncementModal = ({ event, showModal, setShowModal, reloadParent }: IAnnouncementModal) => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [participants, setParticipants] = React.useState<Participant[]>([]);

    const [selectedRadioValue, setSelectedRadioValue] = React.useState<number>(radioValue.SEND_TO_ALL);

    const [form] = useForm();

    const { t } = useTranslation();

    const history = useHistory();

    const onFinish = async (values) => {

        const { message, participantIds } = values;

        setIsLoading(true);
        const response = await sendMessageToVesselParticipants(event.id!, {
            message: message,
            participantIds: participantIds ?? []
        });
        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.event_detail_page.successfully_delivered_your_message_to_the_competitors));
            hideModal();
            reloadParent();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const hideModal = () => {
        setShowModal(false);
        form.resetFields();
    }

    const getAllEventParticipants = async () => {

        const response = await getAcceptedAndSelfRegisteredParticipantByCalendarEventId(event.id!, 1, 1000);

        if (response.success) {
            setParticipants(response.data?.rows);
        }
    }

    const renderParticipantsList = () => {
        return participants.map(item => <Select.Option style={{ padding: '5px' }} value={item.id}>
            <ItemAvatar onClick={(e) => navigateToProfile(e, item, history)} src={renderAvatar(item.profile?.avatar)} /> {item.publicName}
        </Select.Option>)
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
                    <SyrfFormSelect mode='multiple'
                        allowClear
                        maxTagCount={'responsive'}
                        filterOption={(input, option) => {
                            if (option) {
                                // the option.props.children[2] is where the name of the participant lies.
                                return option.props.children[2]?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }

                            return false;
                        }}>
                        {renderParticipantsList()}
                    </SyrfFormSelect>
                </Form.Item>
        }
    }

    if (participants.length > 0)
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

    return (
        <Modal
            title={t(translations.event_detail_page.send_announcement)}
            bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}
            visible={showModal}
            cancelButtonProps={{ style: { display: 'none' } }}
            onOk={hideModal}
            onCancel={hideModal}
        >
            <span>{t(translations.event_detail_page.please_invite_at_least_1_competitor_to_send_announcement)}</span>
        </Modal>
    )
}