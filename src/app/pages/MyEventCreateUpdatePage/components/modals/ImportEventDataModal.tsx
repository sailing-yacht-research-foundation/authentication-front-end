import React from 'react';
import { Modal, Form, Select, Spin } from 'antd';
import { SyrfFieldLabel, SyrfFormButton } from 'app/components/SyrfForm';
import { toast } from 'react-toastify';
import { SyrfFormSelect } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { getCredentialByPage, getEventsUsingCredentialId, importEventFromExternalEvent } from 'services/live-data-server/external-platform';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const ImportEventDataModal = (props) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();

    const { showModal, setShowModal, calendarEventId } = props;

    const [isLoading, setIsLoading] = React.useState(false);

    const [credentials, setCredentials] = React.useState<any[]>([]);

    const [events, setEvents] = React.useState<any[]>([]);

    const [isLoadingCredentials, setIsLoadingCredentials] = React.useState<boolean>(false);

    const [isLoadingEventsUsingCredential, setIsLoadingEventsUsingCredential] = React.useState<boolean>(false);

    const hideModal = () => {
        setShowModal(false);
        form.resetFields();
    }

    const onFinish = async (values) => {
        const { credentialId, eventId } = values;
        setIsLoading(true);
        const response = await importEventFromExternalEvent(credentialId, eventId, calendarEventId);
        setIsLoading(false);

        if (response.success) {
            toast.info(t(translations.my_event_create_update_page.we_are_importing_event_data_to_this_event));
            hideModal();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const renderCredentialsList = () => {
        return credentials.map((credential, index) => {
            return <Select.Option key={index} value={credential.id}>{credential.userId}</Select.Option>
        });
    }

    const renderEventsList = () => {
        return events.map((event, index) => {
            return <Select.Option key={index} value={event.eventId}>{event.eventName}</Select.Option>
        });
    }

    const getAllCredentials = async () => {
        setIsLoadingCredentials(true);
        const response = await getCredentialByPage({ page: 1, size: 100 }); // temporary get first 100 credentials.
        setIsLoadingCredentials(false);

        if (response.success) {
            setCredentials(response.data.rows);
        }
    }

    const getEventsByCredential = async (credentialId) => {
        setIsLoadingEventsUsingCredential(true);
        const response = await getEventsUsingCredentialId(credentialId);
        setIsLoadingEventsUsingCredential(false);

        if (response.success) {
            setEvents(response.data?.events);
        }
    }

    React.useEffect(() => {
        getAllCredentials();
    }, []);

    return (
        <Modal
            title={t(translations.my_event_create_update_page.import_data_from_external_source)}
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
                    initialValues={{
                        source: 'YACHTSCORING'
                    }}
                >
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.please_select_a_credential)}</SyrfFieldLabel>}
                        name="credentialId"
                        rules={[{ required: true, message: t(translations.my_event_create_update_page.please_select_a_credential) }]}
                        help={isLoadingCredentials && <StyledSpinContainer>
                            <Spin spinning></Spin>
                        </StyledSpinContainer>}
                    >
                        <SyrfFormSelect onChange={getEventsByCredential}>
                            {renderCredentialsList()}
                        </SyrfFormSelect>
                    </Form.Item>

                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.then_select_an_event_of_the_above_credential)}</SyrfFieldLabel>}
                        name="eventId"
                        rules={[{ required: true, message: t(translations.my_event_create_update_page.event_is_required) }]}
                        help={isLoadingEventsUsingCredential && <StyledSpinContainer>
                            <Spin spinning></Spin>
                        </StyledSpinContainer>}
                    >
                        <SyrfFormSelect>
                            {renderEventsList()}
                        </SyrfFormSelect>
                    </Form.Item>

                    <Form.Item>
                        <SyrfFormButton type="primary" htmlType="submit">
                            {t(translations.my_event_create_update_page.import)}
                        </SyrfFormButton>
                    </Form.Item>
                </Form>
                <Message>{t(translations.tip.if_you_havent_linked_any_credentials)} <Link to={`/account/integrations`}>{t(translations.tip.integrations_page)}</Link></Message>
            </Spin>
        </Modal>
    )
}

const StyledSpinContainer = styled.div`
    position: absolute;
    right: 10px;
    top: 7px;
`;

const Message = styled.span`
    font-size: 14px;
`;