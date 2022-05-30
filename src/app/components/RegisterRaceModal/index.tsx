import React from 'react';
import { Modal, Spin, Form, Select, Button, Space } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfInputField } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { getMany } from 'services/live-data-server/vessels';
import styled from 'styled-components';
import { handleOnBoatSelected, showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { joinCompetitionUnit } from 'services/live-data-server/open-competition';
import { Vessel } from 'types/Vessel';
import { get } from 'services/live-data-server/event-calendars';
import { CalendarEvent } from 'types/CalendarEvent';
import { InformationSharing } from './InformationSharing';

interface IRegisterRaceModal {
    showModal: boolean
    setShowModal: Function,
    raceName: string,
    raceId: string,
    lon: number,
    lat: number,
    setRelation?: Function,
    eventId: string,
}

export const RegisterRaceModal = ({ showModal, setShowModal, raceName, raceId, lon, lat, setRelation, eventId }: IRegisterRaceModal) => {

    const { t } = useTranslation();

    const [boats, setBoats] = React.useState<Vessel[]>([]);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [event, setEvent] = React.useState<Partial<CalendarEvent>>({});

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
                    vesselId: response.data?.rows[0]?.id,
                    sailNumber: response.data?.rows[0]?.sailNumber
                });
            }
        }
    }

    const renderBoatsList = () => {
        return boats.map(item => <Select.Option value={item.id}>{item.publicName}</Select.Option>)
    }

    const onFinish = async (values) => {
        const { vesselId, allowShareInformation, sailNumber } = values;

        setIsLoading(true);
        const response = await joinCompetitionUnit(raceId, vesselId, sailNumber, allowShareInformation, lon, lat);
        setIsLoading(false);

        if (response.success) {
            hideModal();
            toast.success(t(translations.home_page.successfully_registered_to_join_this_competition));
            if (setRelation) setRelation({
                isParticipating: true
            });
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    React.useEffect(() => {
        if (showModal) {
            getAndSetCalendarEvent();
            getUserBoats();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal]);

    const getAndSetCalendarEvent = async () => {
        const response = await get(eventId);
        if (response.success) setEvent(response.data);
    }

    return (<Modal
        title={t(translations.my_event_list_page.register_for, { raceName: raceName })}
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
                        name="sailNumber">
                        <SyrfInputField />
                    </Form.Item>
                </div>

                <Message>{t(translations.my_event_list_page.some_of_your_information_will_be_shared)}</Message>

                <InformationSharing event={event} t={t} />

                {
                    boats.length <= 1 ?
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
                        </Form.Item>)
                }

            </Form >
        </Spin >
    </Modal >);
}

const Message = styled.div`
    margin: 20px 0;
`;