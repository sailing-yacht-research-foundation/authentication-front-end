import React from 'react';
import { Spin, Form, Select, Button, Space } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfInputField } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import styled from 'styled-components';
import { handleOnBoatSelected } from 'utils/helpers';
import { InformationSharing } from './InformationSharing';
import { CalendarEvent } from 'types/CalendarEvent';
import { Vessel } from 'types/Vessel';
import { getMany } from 'services/live-data-server/vessels';
import { get } from 'services/live-data-server/event-calendars';

export const FormContent = ({ form, isLoading, onFinish, setShowModal, t, eventId, showModal }) => {

    const [event, setEvent] = React.useState<Partial<CalendarEvent>>({});

    const [boats, setBoats] = React.useState<Vessel[]>([]);

    const renderBoatsList = () => {
        return boats.map((item, index) => <Select.Option key={index} value={item.id}>{item.publicName}</Select.Option>)
    }

    const getUserBoats = async () => {
        const response = await getMany(1, 100);

        if (response.success) {
            setBoats(response.data?.rows);
            if (response.data?.count > 0) {
                form.setFieldsValue({
                    vesselId: response.data?.rows[0]?.id,
                    sailNumber: response.data?.rows[0]?.sailNumber
                });
            }
        }
    }

    const getAndSetCalendarEvent = async () => {
        const response = await get(eventId);
        if (response.success) setEvent(response.data);
    }

    React.useEffect(() => {
        if (showModal) {
            getAndSetCalendarEvent();
            getUserBoats();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal]);

    return (<>
        <Spin spinning={isLoading}>
            <Form
                form={form}
                layout="vertical"
                name="basic"
                onFinish={onFinish}
                style={{ width: '100%' }}
            >
                <div style={{ display: boats.length > 1 ? 'block' : 'none' }}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_list_page.select_a_boat)}</SyrfFieldLabel>}
                        name="vesselId">
                        <SyrfFormSelect
                            showSearch
                            allowClear
                            placeholder={t(translations.my_event_list_page.select_a_boat)}
                            optionFilterProp="children"
                            onChange={(boatId) => handleOnBoatSelected(boats, boatId, form)}
                        >
                            {renderBoatsList()}
                        </SyrfFormSelect>
                    </Form.Item>

                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_list_page.sail_number)}</SyrfFieldLabel>}
                        rules={[{ max: 50, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 50 }) }]}
                        name="sailNumber">
                        <SyrfInputField />
                    </Form.Item>
                </div>

                <Message>{t(translations.my_event_list_page.some_of_your_information_will_be_shared)}</Message>

                <InformationSharing event={event} t={t} />

                {
                    boats.length <= 1 ?
                        (<StyledSpace size={10}>
                            <Button type='primary' onClick={() => form.submit()}>
                                {t(translations.my_event_list_page.yes)}
                            </Button>
                            <Button onClick={() => setShowModal(false)}>
                                {t(translations.my_event_list_page.no)}
                            </Button>

                        </StyledSpace>) : (<Form.Item>
                            <SyrfFormButton type="primary" htmlType="submit">
                                {t(translations.home_page.register_as_captain)}
                            </SyrfFormButton>
                        </Form.Item>)
                }

            </Form >
        </Spin >
    </>);
}

const StyledSpace = styled(Space)`
    justify-content: flex-end;
    width: 100%;
`;

const Message = styled.div`
    margin: 20px 0;
`;
