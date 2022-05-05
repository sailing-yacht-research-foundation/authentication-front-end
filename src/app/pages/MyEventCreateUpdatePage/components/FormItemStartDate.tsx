import React from 'react';
import { SyrfFieldLabel, SyrfFormSelect } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { Row, Col, Form, DatePicker, TimePicker, Tooltip } from 'antd';
import moment from 'moment';

export const FormItemStartDate = ({ renderErrorField, handleFieldChange, renderTimezoneDropdownList, error, dateLimiter }) => {

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
                        }]}
                        validateStatus={(renderErrorField(error, 'startDate') && 'error') || ''}
                        help={renderErrorField(error, 'startDate')}
                    >
                        <DatePicker
                            allowClear={false}
                            onChange={(val) => handleFieldChange('startDate', val)}
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
                        rules={[{ required: true, message: t(translations.forms.start_time_is_required) }]}
                        validateStatus={(renderErrorField(error, 'startTime') && 'error') || ''}
                        help={renderErrorField(error, 'startTime')}
                    >
                        <TimePicker
                            allowClear={false}
                            onChange={(val) => handleFieldChange('startTime', val)}
                            className="syrf-datepicker"
                            defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
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