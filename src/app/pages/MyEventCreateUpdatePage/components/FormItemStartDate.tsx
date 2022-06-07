import React from 'react';
import { SyrfFieldLabel, SyrfFormSelect } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { Row, Col, Form, DatePicker, TimePicker, Tooltip } from 'antd';
import moment from 'moment';
import { TIME_FORMAT } from 'utils/constants';

export const FormItemStartDate = ({ renderTimezoneDropdownList, dateLimiter }) => {

    const { t } = useTranslation();

    return (
        <Row gutter={12}>
            <Col xs={24} sm={24} md={8} lg={8}>
                <Tooltip title={t(translations.tip.event_start_date)}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.start_date)}</SyrfFieldLabel>}
                        name="startDate"
                        className="event-start-date-step"
                        rules={[{ type: 'date' }, {
                            required: true,
                            message: t(translations.forms.start_date_is_required)
                        }, ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || !getFieldValue('endDate') || moment(value.format(TIME_FORMAT.number)).isSameOrBefore(getFieldValue('endDate').format(TIME_FORMAT.number))) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t(translations.my_event_create_update_page.error_starttime_should_be_less_than_end_time)));
                            },
                        })]}
                    >
                        <DatePicker
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
            </Col>

            <Col xs={24} sm={24} md={8} lg={8}>
                <Tooltip title={t(translations.tip.event_start_time)}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.start_time)}</SyrfFieldLabel>}
                        name="startTime"
                        className="event-start-time-step"
                        rules={[{ required: true, message: t(translations.forms.start_time_is_required) }, ({ getFieldValue }) => ({
                            validator(_, value) {
                                const startTime = getFieldValue('startTime');
                                const startDate = getFieldValue('startDate').local().set({ hour: startTime.hour(), minute: startTime.minutes(), second: startTime.seconds() });
                                const endTime = getFieldValue('endTime');
                                const endDate = getFieldValue('endDate').local().set({ hour: endTime.hour(), minute: endTime.minutes(), second: endTime.seconds() });
                                const isStartDateTimeBeforeEndDateTime = startDate.isBefore(endDate);

                                if (!value || (!getFieldValue('endTime') && !!getFieldValue('endDate')) || isStartDateTimeBeforeEndDateTime) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error(t(translations.my_event_create_update_page.error_starttime_should_be_less_than_end_time)));
                            },
                        })]}
                    >
                        <TimePicker
                            // renderExtraFooter={() => <a>qdwdqwdqw</a>}
                            allowClear={false}
                            className="syrf-datepicker"
                            defaultOpenValue={moment('00:00:00', TIME_FORMAT.time)}
                        />
                    </Form.Item>
                </Tooltip>
            </Col>

            <Col xs={24} sm={24} md={8} lg={8}>
                <Tooltip title={t(translations.tip.event_time_zone)}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.timezone)}</SyrfFieldLabel>}
                        name="approximateStartTime_zone"
                        className="event-time-zone-step"
                        rules={[{ required: true }]}
                    >
                        <SyrfFormSelect placeholder={t(translations.my_event_create_update_page.timezone)}
                            showSearch
                            disabled
                            filterOption={(input, option) => {
                                if (option) {
                                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }

                                return false;
                            }}
                        >
                            {
                                renderTimezoneDropdownList()
                            }
                        </SyrfFormSelect>
                    </Form.Item>
                </Tooltip>
            </Col>
        </Row>
    )
}