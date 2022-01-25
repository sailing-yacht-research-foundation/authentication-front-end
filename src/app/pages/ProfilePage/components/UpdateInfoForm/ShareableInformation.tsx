import React from 'react';
import { Col, Row, Form, DatePicker, Input, Button } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { SyrfFieldLabel, SyrfFormTitle, SyrfInputField, SyrfPhoneInput } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { removeCovidCard, removePassportPhoto } from 'services/live-data-server/user';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { ConfirmModal } from 'app/components/ConfirmModal';

export const ShareableInformation = (props) => {

    const { shareableInformation, setShareableInformation } = props;

    const [showRemoveCovidCardConfirmModal, setShowRemoveCovidCardConfirmModal] = React.useState<boolean>(false);

    const [showRemovePassportConfirmModal, setShowRemovePassportConfirmModal] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.target?.files[0];
    }

    const removeUserPassportPhoto = async () => {
        const response = await removePassportPhoto();

        if (response.success) {
            setShareableInformation({
                ...shareableInformation,
                passportPhoto: null
            });
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowRemovePassportConfirmModal(false);
    }

    const removeUserCovidCard = async () => {
        const response = await removeCovidCard();

        if (response.success) {
            setShareableInformation({
                ...shareableInformation,
                covidVaccinationCard: null
            });
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowRemoveCovidCardConfirmModal(false);
    }

    return (
        <Wrapper>
            <ConfirmModal
                showModal={showRemoveCovidCardConfirmModal}
                onCancel={() => setShowRemoveCovidCardConfirmModal(false)}
                title={t(translations.profile_page.update_profile.remove_covid_card)}
                content={t(translations.profile_page.update_profile.are_you_sure_you_want_to_remove_covid_card)}
                onOk={removeUserCovidCard} />
            <ConfirmModal
                showModal={showRemovePassportConfirmModal}
                title={t(translations.profile_page.update_profile.remove_passport_photo)}
                content={t(translations.profile_page.update_profile.are_you_sure_you_want_to_remove_passport_photo)}
                onCancel={() => setShowRemovePassportConfirmModal(false)}
                onOk={removeUserPassportPhoto} />
            <SyrfFormTitle>{t(translations.profile_page.update_profile.shareable_information)}</SyrfFormTitle>
            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.emergency_contact_name)}</SyrfFieldLabel>}
                        name="emergencyContactName"
                        data-tip={t(translations.profile_page.update_profile.emergency_contact_name)}
                        rules={[{ max: 25, message: t(translations.forms.emergency_name_must_not_be_greater_than_25_chars) }]}
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
                        <SyrfPhoneInput
                            inputClass="syrf-phone-number-input"
                            buttonClass="syrf-flag-dropdown"
                            placeholder={t(translations.profile_page.update_profile.enter_phone_number)} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.emergency_contact_email)}</SyrfFieldLabel>}
                        name="emergencyContactEmail"
                        data-tip={t(translations.profile_page.update_profile.address)}
                        rules={[{
                            type: 'email', message: t(translations.forms.email_must_be_valid)
                        }]}
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
                        rules={[{ max: 25, message: t(translations.forms.emergency_relationship_must_not_be_greater_than_25_chars) }]}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.passport_photo)}</SyrfFieldLabel>}
                        name="passportPhoto"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        data-tip={t(translations.profile_page.update_profile.passport_photo)}
                    >
                        <Input type={'file'} accept="image/png, image/jpeg" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.passport_number)}</SyrfFieldLabel>}
                        name="passportNumber"
                        data-tip={t(translations.profile_page.update_profile.passport_number)}
                        rules={[{ min: 6, message: t(translations.forms.passport_must_be_a_number_with_at_least_5_digits) }, () => ({
                            validator(_, value) {
                                if (isNaN(value) && value.length > 0) {
                                    return Promise.reject(t(translations.forms.please_input_number));
                                }
                                return Promise.resolve();
                            },
                        })]}
                    >
                        <SyrfInputField/>
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
                        <DatePicker
                            style={{ width: '100%' }}
                            className="syrf-datepicker"
                            showToday={false}
                            dateRender={current => {
                                return (
                                    <div className="ant-picker-cell-inner">
                                        {current.date()}
                                    </div>
                                );
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.passport_expiration_date)}</SyrfFieldLabel>}
                        name="passportExpirationDate"
                        data-tip={t(translations.profile_page.update_profile.passport_expiration_date)}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            className="syrf-datepicker"
                            showToday={false}
                            dateRender={current => {
                                return (
                                    <div className="ant-picker-cell-inner">
                                        {current.date()}
                                    </div>
                                );
                            }}
                        />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.food_allergies)}</SyrfFieldLabel>}
                        name="foodAllergies"
                        data-tip={t(translations.profile_page.update_profile.food_allergies)}
                        rules={[{ message: t(translations.forms.food_allergies_must_not_be_more_than_50_characters) }]}
                    >
                        <SyrfInputField placeholder={t(translations.forms.please_input_in_commas_separated_format)} />
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
                        rules={[{ max: 255, message: t(translations.forms.please_input_no_more_than_255_characters) }]}
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

            <Row gutter={12}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.epirbBeaconHexId)}</SyrfFieldLabel>}
                        name="epirbBeaconHexId"
                        data-tip={t(translations.profile_page.update_profile.epirbBeaconHexId)}
                    >
                        <SyrfInputField />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.covid_vaccination_card)}</SyrfFieldLabel>}
                        name="covidVaccinationCard"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        data-tip={t(translations.profile_page.update_profile.covid_vaccination_card)}
                    >
                        <SyrfInputField type='file' accept="image/png, image/jpeg" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    {shareableInformation.passportPhoto && <PassportPhotoWrapper>
                        <PhotoHeaderContainer>
                            <h3>{t(translations.profile_page.update_profile.your_uploaded_passport)}</h3>
                            <Button type="link" danger onClick={() => setShowRemovePassportConfirmModal(true)}>{t(translations.profile_page.update_profile.remove)}</Button>
                        </PhotoHeaderContainer>
                        <img src={`data:image/png;base64, ${shareableInformation.passportPhoto}`} />

                    </PassportPhotoWrapper>}
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    {shareableInformation.covidVaccinationCard && <PassportPhotoWrapper>
                        <PhotoHeaderContainer>
                            <h3>{t(translations.profile_page.update_profile.your_uploaded_vaccination_card)}</h3>
                            <Button type="link" danger onClick={() => setShowRemoveCovidCardConfirmModal(true)}>{t(translations.profile_page.update_profile.remove)}</Button>
                        </PhotoHeaderContainer>
                        <img src={`data:image/png;base64, ${shareableInformation.covidVaccinationCard}`} />
                    </PassportPhotoWrapper>}
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

const PassportPhotoWrapper = styled.div`
    width: 100%;

    img {
        width: 100%;
        height: 100%px;
        object-fit: cover;
    }
`;

const PhotoHeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;