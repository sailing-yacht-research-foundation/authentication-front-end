import React from 'react';
import { Modal, Spin, Form, Select, Button, Space, Checkbox } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { getVesselParticipantGroupsByEventId } from 'services/live-data-server/vessel-participant-group';
import { getMany } from 'services/live-data-server/vessels';
import styled from 'styled-components';
import { acceptInvitation } from 'services/live-data-server/participants';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';

export const AcceptInvitationModal = (props) => {

    const { t } = useTranslation();

    const { showModal, setShowModal, request, reloadParent } = props;

    const [classes, setClasses] = React.useState<any[]>([]);

    const [boats, setBoats] = React.useState<any[]>([]);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [form] = Form.useForm();

    const hideModal = () => {
        setShowModal(false);
        if (reloadParent) {
            reloadParent();
        }
    }

    const getUserBoats = async () => {
        const response = await getMany(1, 100);

        if (response.success) {
            setBoats(response.data?.rows);
            if (response.data?.count > 0) {
                form.setFieldsValue({
                    vesselId: response.data?.rows[0]?.id
                });
            }
        }
    }

    const getEventClasses = async () => {
        const response = await getVesselParticipantGroupsByEventId(request?.event?.id, 1, 100);

        if (response.success) {
            setClasses(response.data?.rows);
            if (response.data?.count > 0) {
                form.setFieldsValue({
                    vesselParticipantGroupId: response.data?.rows[0]?.id
                });
            }
        }
    }

    const renderBoatsList = () => {
        return boats.map(item => <Select.Option key={item.id} value={item.id}>{item.publicName}</Select.Option>)
    }

    const renderClassesList = () => {
        return classes.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
    }

    const onFinish = async (values) => {
        const { vesselId, vesselParticipantGroupId, allowShareInformation } = values;

        setIsLoading(true);
        const response = await acceptInvitation(request?.id, vesselId, vesselParticipantGroupId, allowShareInformation);
        setIsLoading(false);

        if (response.success) {
            hideModal();
            toast.success(t(translations.my_event_list_page.accepted_the_request));
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    React.useEffect(() => {
        if (request?.event) {
            getEventClasses();
            getUserBoats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [request]);

    return (<Modal
        title={t(translations.my_event_list_page.register_for, { raceName: request?.event?.name })}
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
                {boats.length <= 1 && classes.length > 0 && <Message>{t(translations.my_event_list_page.some_of_your_information_will_be_shared)}</Message>}
                <Form.Item
                    style={{ display: boats.length > 1 ? 'block' : 'none' }}
                    label={<SyrfFieldLabel>{t(translations.my_event_list_page.select_a_boat)}</SyrfFieldLabel>}
                    name="vesselId">
                    <SyrfFormSelect
                        showSearch
                        allowClear
                        placeholder={t(translations.my_event_list_page.select_a_boat)}
                        optionFilterProp="children"
                    >
                        {renderBoatsList()}
                    </SyrfFormSelect>
                </Form.Item>

                <Form.Item
                    style={{ display: classes.length > 1 ? 'block' : 'none' }}
                    label={<SyrfFieldLabel>{t(translations.my_event_list_page.select_a_class)}</SyrfFieldLabel>}
                    name="vesselParticipantGroupId"
                    rules={[{ required: true, message: t(translations.my_event_list_page.please_select_a_class_to_join_this_event) }]}
                >
                    <SyrfFormSelect
                        showSearch
                        allowClear
                        placeholder={t(translations.my_event_list_page.select_a_class)}
                        optionFilterProp="children"
                    >
                        {renderClassesList()}
                    </SyrfFormSelect>
                </Form.Item>

                <Form.Item
                    name="allowShareInformation"
                    valuePropName="checked"
                >
                    <Checkbox>{t(translations.my_event_list_page.agree_to_share_information)}</Checkbox>
                </Form.Item>

                {boats.length <= 1 && classes.length > 0 ?
                    (<Space style={{ justifyContent: 'flex-end', width: '100%' }} size={10}>
                        <Button type='primary' onClick={() => form.submit()}>
                            {t(translations.my_event_list_page.yes)}
                        </Button>
                        <Button onClick={() => setShowModal(false)}>
                            {t(translations.my_event_list_page.no)}
                        </Button>

                    </Space>) : (<Form.Item>
                        <SyrfFormButton type="primary" htmlType="submit">
                            {t(translations.my_event_list_page.register_as_a_competitor)}
                        </SyrfFormButton>
                    </Form.Item>)}

            </Form>
        </Spin>
    </Modal >);
}

const Message = styled.div`
    margin: 20px 0;
`;