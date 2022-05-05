import React from 'react';
import { SyrfFieldLabel, SyrfFormSelect } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { Row, Col, Form, DatePicker, TimePicker, Tooltip } from 'antd';
import moment from 'moment';

export const FormItemEndDate = ({ renderErrorField, handleFieldChange, endDateLimiter, error, renderTimezoneDropdownList }) => {
    const { t } = useTranslation();

    return (
        <Row gutter={12}>
            <Col xs={24} sm={24} md={8} lg={8}>
                <Tooltip title={t(translations.tip.event_end_date)}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.end_date)}</SyrfFieldLabel>}
                        name="endDate"
                        className="event-start-date-step"
                        validateStatus={(renderErrorField(error, 'endDate') && 'error') || ''}
                        help={renderErrorField(error, 'endDate')}
                    >
                        <DatePicker
                            onChange={(val) => handleFieldChange('endDate', val)}
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
            </Col>

            <Col xs={24} sm={24} md={8} lg={8}>
                <Tooltip title={t(translations.tip.event_end_time)}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.end_time)}</SyrfFieldLabel>}
                        name="endTime"
                        className="event-start-time-step"
                        validateStatus={(renderErrorField(error, 'endTime') && 'error') || ''}
                        help={renderErrorField(error, 'endTime')}
                    >
                        <TimePicker
                            onChange={(val) => handleFieldChange('endTime', val)}
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
                        name="approximateEndTime_zone"
                        className="event-time-zone-step"
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