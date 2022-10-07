import * as React from 'react';
import { DatePicker, Form, Modal, Spin, Tooltip } from 'antd';
import { toast } from 'react-toastify';
import {
    SyrfFieldLabel,
    SyrfFormButton,
    SyrfInputField
} from 'app/components/SyrfForm';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { CalendarEvent } from 'types/CalendarEvent';
import { cloneEvent } from 'services/live-data-server/event-calendars';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { useMyEventListSlice } from '../../slice';

interface ICloneEventModal {
    showModal: boolean,
    setShowModal: Function,
    event: Partial<CalendarEvent>
}

export const CloneEventModal = ({ setShowModal, showModal, event }: ICloneEventModal) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const dispatch = useDispatch();

    const { actions } = useMyEventListSlice();

    const onFinish = async (values) => {
        const { approximateStartTime, approximateEndTime, name } = values;

        setIsLoading(true);
        const response: any = await cloneEvent(event.id!, name, approximateStartTime, approximateEndTime);
        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.general.your_action_is_successful));
            hideModal();
            dispatch(actions.getEvents({ page: 1, size: 10 }));
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const hideModal = () => {
        form.resetFields();
        setShowModal(false);
    }

    const dateLimiter = (current) => {
        return current && current < moment().startOf('day');
    };

    const endDateLimiter = (current) => {
        const { approximateStartTime } = form.getFieldsValue();
        const currentStartDate = (approximateStartTime || moment());
        return current && current < currentStartDate.startOf('day');
    }

    React.useEffect(() => {
        if (event.name) {
            form.setFieldsValue({ name: event.name });
        }
    }, [event.name]);

    return (
        <Modal onCancel={hideModal} title={t(translations.my_event_list_page.clone_event_name, { name: event.name })} visible={showModal} footer={null}>
            <Spin spinning={isLoading}>
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    onFinish={onFinish}
                    initialValues={{
                        name: event.name || ''
                    }}
                >
                    <Tooltip title={t(translations.my_event_list_page.new_name)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.my_event_list_page.new_name)}</SyrfFieldLabel>}
                            name="name"
                            data-tip={t(translations.my_event_list_page.new_name)}
                            rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }]}
                        >
                            <SyrfInputField />
                        </Form.Item>
                    </Tooltip>

                    <Tooltip title={t(translations.general.start_time)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.general.start_time)}</SyrfFieldLabel>}
                            name="approximateStartTime"
                            data-tip={t(translations.general.start_time)}
                            rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }, ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const startTime = getFieldValue('approximateStartTime');
                                    const endTime = getFieldValue('approximateEndTime');
                                    const isStartDateTimeBeforeEndDateTime = startTime?.isBefore(endTime);

                                    if (!value || !getFieldValue('approximateEndTime') || isStartDateTimeBeforeEndDateTime) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t(translations.my_event_create_update_page.error_starttime_should_be_less_than_end_time)));
                                },
                            })]}
                        >
                            <DatePicker
                                showTime
                                allowClear={false}
                                showToday={true}
                                disabledDate={dateLimiter}
                                className="syrf-datepicker"
                                style={{ width: '100%' }}
                                dateRender={current => {
                                    return (
                                        <div className="ant-picker-cell-inner">
                                            {current.date()}
                                        </div>
                                    );
                                }}
                            />
                        </Form.Item>
                    </Tooltip>

                    <Tooltip title={t(translations.my_event_create_update_page.end_time)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.end_time)}</SyrfFieldLabel>}
                            name="approximateEndTime"
                            rules={[{ type: 'date' }, ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const startTime = getFieldValue('approximateStartTime');
                                    const endTime = getFieldValue('approximateEndTime');
                                    let isStartDateTimeAfterEndDateTime = true;
                                    if (endTime) {
                                        isStartDateTimeAfterEndDateTime = endTime?.isAfter(startTime);
                                    }

                                    if (!value || !getFieldValue('approximateStartTime') || isStartDateTimeAfterEndDateTime) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t(translations.my_event_create_update_page.error_starttime_should_be_less_than_end_time)));
                                },
                            })]}
                        >
                            <DatePicker
                                showTime
                                showToday={true}
                                disabledDate={endDateLimiter}
                                className="syrf-datepicker"
                                style={{ width: '100%' }}
                                dateRender={current => {
                                    return (
                                        <div className="ant-picker-cell-inner">
                                            {current.date()}
                                        </div>
                                    );
                                }}
                            />
                        </Form.Item>
                    </Tooltip>

                    <Form.Item>
                        <SyrfFormButton type="primary" htmlType="submit">
                            {t(translations.my_event_list_page.clone_event)}
                        </SyrfFormButton>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}
