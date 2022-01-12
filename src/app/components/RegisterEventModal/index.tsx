import React from 'react';
import { Modal, Spin, Form, Select, Button, Space } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { getMany } from 'services/live-data-server/vessels';
import styled from 'styled-components';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { joinCompetitionUnit } from 'services/live-data-server/open-competition';

export const RegisterEventModal = (props) => {

    const { t } = useTranslation();

    const { showModal, setShowModal, eventName, raceId, lon, lat } = props;

    const [boats, setBoats] = React.useState<any[]>([]);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [form] = Form.useForm();

    const hideModal = () => {
        setShowModal(false);
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

    const renderBoatsList = () => {
        return boats.map(item => <Select.Option value={item.id}>{item.publicName}</Select.Option>)
    }

    const onFinish = async (values) => {
        const { vesselId } = values;

        setIsLoading(true);
        const response = await joinCompetitionUnit(raceId, vesselId, lon, lat);
        setIsLoading(false);

        if (response.success) {
            hideModal();
            toast.success(t(translations.home_page.successfully_registered_to_join_this_competition));
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    React.useEffect(() => {
        if (showModal)
            getUserBoats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal]);

    return (<Modal
        title={t(translations.my_event_list_page.register_for, { eventName: eventName })}
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
                {boats.length <= 1 && <Message>{t(translations.my_event_list_page.some_of_your_information_will_be_shared)}</Message>}
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

                {boats.length <= 1 ?
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