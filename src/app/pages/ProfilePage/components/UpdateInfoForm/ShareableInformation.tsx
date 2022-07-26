import React from 'react';
import { Col, Row, Form, DatePicker, Button, Image, Select, Tooltip } from 'antd';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { SyrfFieldLabel, SyrfFormSelect, SyrfFormTitle, SyrfInputField, SyrfPhoneInput } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { removeCovidCard, removePassportPhoto } from 'services/live-data-server/user';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { ConfirmModal } from 'app/components/ConfirmModal';
import { FormPhotoHeaderContainer, FormPhotoWrapper } from 'app/components/SyrfGeneral';
import { certifications } from 'utils/constants';
import { localesList as countryList } from 'utils/languages-util';

export const ShareableInformation = (props) => {

    const { shareableInformation, setShareableInformation, form } = props;

    const [showRemoveCovidCardConfirmModal, setShowRemoveCovidCardConfirmModal] = React.useState<boolean>(false);

    const [showRemovePassportConfirmModal, setShowRemovePassportConfirmModal] = React.useState<boolean>(false);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.target?.files[0];
    }

    const removeUserPassportPhoto = async () => {
        setIsLoading(true);
        const response = await removePassportPhoto();
        setIsLoading(false);

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
        setIsLoading(true);
        const response = await removeCovidCard();
        setIsLoading(false);

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

    const renderCertificationsDropdownList = () => {
        return <>
            <Select.Option value={'none'}>{t(translations.forms.none)}</Select.Option>
            {certifications.map((type, index) => <Select.Option key={index} value={type}>{type}</Select.Option>)}
        </>
    }

    const renderTagsDropdownList = () => {
        return <Select.Option value={'none'}>{t(translations.forms.none)}</Select.Option>
    }

    const handleTagsFieldChange = (values, fieldName) => {
        if (values.includes('none')) {
            const object = {};
            object[fieldName] = ['none'];
            form.setFieldsValue(object);
        }
    }

    const renderCountryDropdownList = () => {
        const objectArray = Object.entries(countryList);

        return objectArray.map(([key, value]) => {
            return <Select.Option key={key} value={value}>{value}</Select.Option>
        });
    }

    return (
        <Wrapper>
            <ConfirmModal
                loading={isLoading}
                showModal={showRemoveCovidCardConfirmModal}
                onCancel={() => setShowRemoveCovidCardConfirmModal(false)}
                title={t(translations.profile_page.update_profile.remove_covid_card)}
                content={t(translations.profile_page.update_profile.are_you_sure_you_want_to_remove_covid_card)}
                onOk={removeUserCovidCard} />
            <ConfirmModal
                loading={isLoading}
                showModal={showRemovePassportConfirmModal}
                title={t(translations.profile_page.update_profile.remove_passport_photo)}
                content={t(translations.profile_page.update_profile.are_you_sure_you_want_to_remove_passport_photo)}
                onCancel={() => setShowRemovePassportConfirmModal(false)}
                onOk={removeUserPassportPhoto} />
            <SyrfFormTitle>{t(translations.profile_page.update_profile.shareable_information)}</SyrfFormTitle>
            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.emergency_contact_name)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.emergency_contact_name)}</SyrfFieldLabel>}
                            name="emergencyContactName"
                            rules={[{ max: 25, message: t(translations.forms.emergency_name_must_not_be_greater_than_25_chars) }]}
                        >
                            <SyrfInputField autoComplete="off" autoCorrect="off" autoCapitalize="off" />
                        </Form.Item>
                    </Tooltip>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.emergency_contact_phone)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.emergency_contact_phone)}</SyrfFieldLabel>}
                            name="emergencyContactPhone"
                        >
                            <SyrfPhoneInput
                                inputProps={{ autoComplete: 'none' }}
                                inputClass="syrf-phone-number-input"
                                buttonClass="syrf-flag-dropdown"
                                placeholder={t(translations.profile_page.update_profile.enter_phone_number)} />
                        </Form.Item>
                    </Tooltip>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.address)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.emergency_contact_email)}</SyrfFieldLabel>}
                            name="emergencyContactEmail"
                            rules={[{
                                type: 'email', message: t(translations.forms.email_must_be_valid)
                            }, { max: 45, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 45 }) }]}
                        >
                            <SyrfInputField autoComplete="off" autoCorrect="off" autoCapitalize="off" />
                        </Form.Item>
                    </Tooltip>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.emergency_contact_relationship)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.emergency_contact_relationship)}</SyrfFieldLabel>}
                            name="emergencyContactRelationship"
                            rules={[{ max: 25, message: t(translations.forms.emergency_relationship_must_not_be_greater_than_25_chars) }]}
                        >
                            <SyrfInputField autoComplete="off" autoCorrect="off" autoCapitalize="off" />
                        </Form.Item>
                    </Tooltip>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.passport_photo)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.passport_photo)}</SyrfFieldLabel>}
                            name="passportPhoto"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <SyrfInputField type={'file'} accept="image/png, image/jpeg" />
                        </Form.Item>
                    </Tooltip>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.passport_number)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.passport_number)}</SyrfFieldLabel>}
                            name="passportNumber"
                            rules={[{ min: 5, message: t(translations.forms.please_input_at_least_characters, { numberOfChars: 5 }) }, { max: 25, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 25 }) }]}
                        >
                            <SyrfInputField autoComplete="off" autoCorrect="off" autoCapitalize="off" />
                        </Form.Item>
                    </Tooltip>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.passport_issue_date)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.passport_issue_date)}</SyrfFieldLabel>}
                            name="passportIssueDate"
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
                    </Tooltip>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.passport_expiration_date)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.passport_expiration_date)}</SyrfFieldLabel>}
                            name="passportExpirationDate"
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
                    </Tooltip>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.passport_issuing_country)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.passport_issuing_country)}</SyrfFieldLabel>}
                            name="passportIssueCountry"
                        >
                            <SyrfFormSelect placeholder={t(translations.profile_page.update_profile.select_a_country)}
                                showSearch
                                filterOption={(input, option) => {
                                    if (option) {
                                        return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }

                                    return false;
                                }}
                            >
                                {renderCountryDropdownList()}
                            </SyrfFormSelect>
                        </Form.Item>
                    </Tooltip>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.certifications)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.certifications)}</SyrfFieldLabel>}
                            name="certifications"
                        >
                            <SyrfFormSelect mode="tags"
                                onChange={values => handleTagsFieldChange(values, 'certifications')}
                                maxTagCount={'responsive'}>
                                {renderCertificationsDropdownList()}
                            </SyrfFormSelect>
                        </Form.Item>
                    </Tooltip>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.medical_problems)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.medical_problems)}</SyrfFieldLabel>}
                            name="medicalProblems"
                        >
                            <SyrfFormSelect
                                maxTagCount={'responsive'}
                                onChange={values => handleTagsFieldChange(values, 'medicalProblems')}
                                mode="tags">
                                {renderTagsDropdownList()}
                            </SyrfFormSelect>
                        </Form.Item>
                    </Tooltip>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.tshirt_size)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.tshirt_size)}</SyrfFieldLabel>}
                            name="tShirtSize"
                            rules={[{ max: 10, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 10 }) }]}
                        >
                            <SyrfInputField autoComplete="off" autoCorrect="off" autoCapitalize="off" />
                        </Form.Item>
                    </Tooltip>
                </Col>
            </Row>

            <Row gutter={12}>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.food_allergies)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.food_allergies)}</SyrfFieldLabel>}
                            name="foodAllergies"
                        >
                            <SyrfFormSelect
                                maxTagCount={'responsive'}
                                onChange={values => handleTagsFieldChange(values, 'foodAllergies')}
                                mode="tags">
                                {renderTagsDropdownList()}
                            </SyrfFormSelect>
                        </Form.Item>
                    </Tooltip>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.epirbBeaconHexId)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.epirbBeaconHexId)}</SyrfFieldLabel>}
                            name="epirbBeaconHexId"
                            rules={[{ max: 30, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 30 }) }]}
                        >
                            <SyrfInputField autoComplete="off" autoCorrect="off" autoCapitalize="off" />
                        </Form.Item>
                    </Tooltip>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Tooltip title={t(translations.profile_page.update_profile.covid_vaccination_card)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.profile_page.update_profile.covid_vaccination_card)}</SyrfFieldLabel>}
                            name="covidVaccinationCard"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <SyrfInputField type='file' accept="image/png, image/jpeg" />
                        </Form.Item>
                    </Tooltip>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    {shareableInformation.passportPhoto && <FormPhotoWrapper>
                        <FormPhotoHeaderContainer>
                            <h3>{t(translations.profile_page.update_profile.your_uploaded_passport)}</h3>
                            <Button type="link" danger onClick={() => setShowRemovePassportConfirmModal(true)}>{t(translations.profile_page.update_profile.remove)}</Button>
                        </FormPhotoHeaderContainer>
                        <Image src={`data:image/png;base64, ${shareableInformation.passportPhoto}`} />

                    </FormPhotoWrapper>}
                </Col>

                <Col xs={24} sm={24} md={12} lg={12}>
                    {shareableInformation.covidVaccinationCard && <FormPhotoWrapper>
                        <FormPhotoHeaderContainer>
                            <h3>{t(translations.profile_page.update_profile.your_uploaded_vaccination_card)}</h3>
                            <Button type="link" danger onClick={() => setShowRemoveCovidCardConfirmModal(true)}>{t(translations.profile_page.update_profile.remove)}</Button>
                        </FormPhotoHeaderContainer>
                        <Image src={`data:image/png;base64, ${shareableInformation.covidVaccinationCard}`} />
                    </FormPhotoWrapper>}
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
