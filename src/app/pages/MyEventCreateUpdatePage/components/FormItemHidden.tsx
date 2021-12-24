import React from 'react';
import { Row, Col, Form } from 'antd';
import { SyrfFieldLabel, SyrfInputField } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

export const FormItemHidden = () => {

    const { t } = useTranslation();

    return (
        <>
            <Row gutter={24} style={{ display: 'none' }}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.longitude)}</SyrfFieldLabel>}
                        name="lon"
                        rules={[{ required: true }]}
                    >
                        <SyrfInputField disabled />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.latitude)}</SyrfFieldLabel>}
                        name="lat"
                        rules={[{ required: true }]}
                    >
                        <SyrfInputField disabled />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.latitude)}</SyrfFieldLabel>}
                        name="endLat"
                        rules={[{ required: false }]}
                    >
                        <SyrfInputField disabled />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.latitude)}</SyrfFieldLabel>}
                        name="endLon"
                        rules={[{ required: false }]}
                    >
                        <SyrfInputField disabled />
                    </Form.Item>
                </Col>
            </Row>
        </>
    )
}