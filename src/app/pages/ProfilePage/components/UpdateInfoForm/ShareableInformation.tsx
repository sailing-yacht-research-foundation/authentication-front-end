import React from 'react';
import { Select, Col, Row, Form, DatePicker, Menu, Switch } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { SyrfFieldLabel, SyrfFormTitle, SyrfInputField } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';

export const ShareableInformation = () => {

    const { t } = useTranslation();

    return (
        <Wrapper>
            <SyrfFormTitle>{t(translations.profile_page.update_profile.shareable_information)}</SyrfFormTitle>
            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.emergency_contact_name)}</SyrfFieldLabel>}
                        name="emergencyContactName"
                        data-tip={t(translations.profile_page.update_profile.emergency_contact_name)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.emergency_contact_phone)}</SyrfFieldLabel>}
                        name="emergencyContactPhone"
                        data-tip={t(translations.profile_page.update_profile.emergency_contact_phone)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.emergency_contact_email)}</SyrfFieldLabel>}
                        name="emergencyContactEmail"
                        data-tip={t(translations.profile_page.update_profile.address)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.emergency_contact_relationship)}</SyrfFieldLabel>}
                        name="emergencyContactRelationship"
                        data-tip={t(translations.profile_page.update_profile.emergency_contact_relationship)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.passport_photo)}</SyrfFieldLabel>}
                        name="passportPhoto"
                        data-tip={t(translations.profile_page.update_profile.passport_photo)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.passport_number)}</SyrfFieldLabel>}
                        name="passportNumber"
                        data-tip={t(translations.profile_page.update_profile.passport_number)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.passport_issue_date)}</SyrfFieldLabel>}
                        name="passportIssueDate"
                        data-tip={t(translations.profile_page.update_profile.passport_issue_date)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.passport_expiration_date)}</SyrfFieldLabel>}
                        name="passportExpirationDate"
                        data-tip={t(translations.profile_page.update_profile.passport_expiration_date)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.food_allergies)}</SyrfFieldLabel>}
                        name="foodAllergies"
                        data-tip={t(translations.profile_page.update_profile.food_allergies)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.certifications)}</SyrfFieldLabel>}
                        name="certifications"
                        data-tip={t(translations.profile_page.update_profile.certifications)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.medical_problems)}</SyrfFieldLabel>}
                        name="medicalProblems"
                        data-tip={t(translations.profile_page.update_profile.medical_problems)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.tshirt_size)}</SyrfFieldLabel>}
                        name="tShirtSize"
                        data-tip={t(translations.profile_page.update_profile.tshirt_size)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>
            </Row>
        </Wrapper >
    );
}

const Wrapper = styled.div`
    background: #fff;
    padding: 30px 25px;
    border-radius: 10px;
    margin: 30px 0;
`;