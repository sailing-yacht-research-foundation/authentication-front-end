import React from 'react';
import { Form, Divider, Row, Col, Button, Image, Select } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfInputField, SyrfPhoneInput } from 'app/components/SyrfForm';
import { FormPhotoHeaderContainer, ItemVerifyMessage } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import { FormPhotoWrapper } from 'app/components/SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { VesselType } from 'utils/constants';
import { EditorsField } from './EditorsField';

export const VesselFormFields = (props) => {
    const { vessel, sendVerificationCode, setShowVerifyOnboardPhoneModal, setShowVerifySatellitePhoneModal,
        fieldsValidate, setShowRemovePhotoModal, setShowRemoveDeckPlanModal,
        setShowRemoveHullDiagram, formChanged } = props;

    const { t } = useTranslation();

    const vesselTypes = Object.values(VesselType).map((type) => {
        return {
            name: type.charAt(0).toUpperCase() + type.slice(1).toLowerCase().replace(new RegExp('_', 'g'), ' '),
            value: type
        }
    })


    const renderVesselType = () => {
        return vesselTypes.map((type, index) => {
            return <Select.Option key={index} value={type.value}>{type.name}</Select.Option>
        });
    }

    const renderHullsCountSelection = () => {
        return [1, 2, 3].map((number, index) => {
            return <Select.Option key={index} value={number}>{number}</Select.Option>
        });
    }

    const showPhoneVerifyModalBasedOnField = (field) => {
        if (fieldsValidate.ONBOARD_PHONE === field) {
            setShowVerifyOnboardPhoneModal(true);
        } else {
            setShowVerifySatellitePhoneModal(true);
        }
    }

    const renderVerifiedStatus = (field) => {
        const verified = vessel[field];

        return verified ? (<ItemVerifyMessage className={'verified'}>{t(translations.vessel_create_update_page.verified)}</ItemVerifyMessage>) :
            (
                <ItemVerifyMessage>{t(translations.vessel_create_update_page.not_verified)} <a href="/" onClick={(e) => {
                    e.preventDefault();
                    sendVerificationCode(field);
                    showPhoneVerifyModalBasedOnField(field);
                }}>{t(translations.vessel_create_update_page.verify)}</a></ItemVerifyMessage>
            )
    }

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.target?.files[0];
    }

    return (
        <>
            <Form.Item
                label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.public_name)}</SyrfFieldLabel>}
                name="publicName"
                rules={[{ required: true, message: t(translations.forms.boat_name_is_required) }, 
                    { max: 45, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 45 }) }]}
            >
                <SyrfInputField autoCorrect="off" />
            </Form.Item>


            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.length_in_meters)}</SyrfFieldLabel>}
                        name="lengthInMeters"
                        rules={[() => ({
                            validator(_, value) {
                                if (value === null) {
                                    return Promise.reject(t(translations.vessel_create_update_page.length_in_meters_is_required));
                                }
                                if (isNaN(value) || value <= 0) {
                                    return Promise.reject(t(translations.vessel_create_update_page.length_in_meters_must_be_a_number));
                                }
                                return Promise.resolve();
                            },
                        }), { required: true, message: t(translations.vessel_create_update_page.length_in_meters_is_required) }]}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.model)}</SyrfFieldLabel>}
                        name="model"
                        rules={[{ max: 30, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 30 }) }]}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.vessel_type)}</SyrfFieldLabel>}
                        name="vesselType"
                    >
                        <SyrfFormSelect>
                            {renderVesselType()}
                        </SyrfFormSelect>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.sail_number)}</SyrfFieldLabel>}
                        name="sailNumber"
                        rules={[{ max: 30, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 30 }) }]}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.hull_number)}</SyrfFieldLabel>}
                        name="hullNumber"
                        rules={[{ max: 30, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 30 }) }]}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.call_sign)}</SyrfFieldLabel>}
                        name="callSign"
                        rules={[{ max: 30, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 30 }) }]}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.hull_color_above_the_water_line)}</SyrfFieldLabel>}
                        name="hullColorAboveWaterline"
                        rules={[{ max: 15, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 15 }) }]}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>

                </Col>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.hull_color_below_the_water_line)}</SyrfFieldLabel>}
                        name="hullColorBelowWaterline"
                        rules={[{ max: 15, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 15 }) }]}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.hulls_count)}</SyrfFieldLabel>}
                        name="hullsCount"
                    >
                        <SyrfFormSelect>
                            {renderHullsCountSelection()}
                        </SyrfFormSelect>
                    </Form.Item>

                </Col>
            </Row>


            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.deck_color)}</SyrfFieldLabel>}
                        name="deckColor"
                        rules={[{ max: 15, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 15 }) }]}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.mmsi)}</SyrfFieldLabel>}
                        name="mmsi"
                        rules={[{ max: 40, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 40 }) }]}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.ssbTransceiver)}</SyrfFieldLabel>}
                        name="ssbTransceiver"
                        rules={[{ max: 40, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 40 }) }]}  
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.homeport)}</SyrfFieldLabel>}
                        name="homeport"
                        rules={[{ max: 40, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 40 }) }]}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.rigging)}</SyrfFieldLabel>}
                        name="rigging"
                        rules={[{ max: 40, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 40 }) }]}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.marina_phoneNumber)}</SyrfFieldLabel>}
                        name="marinaPhoneNumber"
                    >
                        <SyrfPhoneInput
                            inputClass="syrf-phone-number-input"
                            buttonClass="syrf-flag-dropdown"
                            placeholder={t(translations.profile_page.update_profile.enter_phone_number)} />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.satellite_number)}</SyrfFieldLabel>}
                        name="satelliteNumber"
                    >
                        <SyrfPhoneInput
                            inputClass="syrf-phone-number-input"
                            buttonClass="syrf-flag-dropdown"
                            placeholder={t(translations.profile_page.update_profile.enter_phone_number)} />
                    </Form.Item>
                    {vessel?.satelliteNumber && renderVerifiedStatus('isVerifiedSatelliteNumber')}
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.onboard_phone)}</SyrfFieldLabel>}
                        name="onboardPhone"
                    >
                        <SyrfPhoneInput
                            inputClass="syrf-phone-number-input"
                            buttonClass="syrf-flag-dropdown"
                            placeholder={t(translations.profile_page.update_profile.enter_phone_number)} />
                    </Form.Item>
                    {vessel?.onboardPhone && renderVerifiedStatus('isVerifiedOnboardPhone')}
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        rules={[{ type: 'email', message: t(translations.vessel_create_update_page.onboard_email_is_not_a_valid_email) }]}
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.onboard_email)}</SyrfFieldLabel>}
                        name="onboardEmail"
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>
            </Row>

            <Form.Item
                label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.epirbHexId)}</SyrfFieldLabel>}
                name="epirbHexId"
                rules={[{ max: 30, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 30 }) }]}
            >
                <SyrfInputField autoCorrect="off" />
            </Form.Item>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.photo)}</SyrfFieldLabel>}
                        name="photo"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        data-tip={t(translations.vessel_create_update_page.photo)}
                    >
                        <SyrfInputField type={'file'} accept="image/png, image/jpeg" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.deck_plan)}</SyrfFieldLabel>}
                        name="deckPlan"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        data-tip={t(translations.vessel_create_update_page.deck_plan)}
                    >
                        <SyrfInputField type={'file'} accept="image/png, image/jpeg" />
                    </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.vessel_create_update_page.hull_diagram)}</SyrfFieldLabel>}
                        name="hullDiagram"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        data-tip={t(translations.vessel_create_update_page.hull_diagram)}
                    >
                        <SyrfInputField type={'file'} accept="image/png, image/jpeg" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={8} lg={8}>
                    {vessel.photo && <FormPhotoWrapper>
                        <FormPhotoHeaderContainer>
                            <h3>{t(translations.vessel_create_update_page.boat_photo)}</h3>
                            <Button type="link" danger onClick={() => setShowRemovePhotoModal(true)}>{t(translations.app.remove)}</Button>
                        </FormPhotoHeaderContainer>
                        <Image src={vessel?.photo[0]} />

                    </FormPhotoWrapper>}
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    {vessel.deckPlan && <FormPhotoWrapper>
                        <FormPhotoHeaderContainer>
                            <h3>{t(translations.vessel_create_update_page.deck_plan_photo)}</h3>
                            <Button type="link" danger onClick={() => setShowRemoveDeckPlanModal(true)}>{t(translations.app.remove)}</Button>
                        </FormPhotoHeaderContainer>
                        <Image src={vessel.deckPlan} />
                    </FormPhotoWrapper>}
                </Col>

                <Col xs={24} sm={24} md={8} lg={8}>
                    {vessel.hullDiagram && <FormPhotoWrapper>
                        <FormPhotoHeaderContainer>
                            <h3>{t(translations.vessel_create_update_page.hull_diagram_photo)}</h3>
                            <Button type="link" danger onClick={() => setShowRemoveHullDiagram(true)}>{t(translations.app.remove)}</Button>
                        </FormPhotoHeaderContainer>
                        <Image src={vessel.hullDiagram} />
                    </FormPhotoWrapper>}
                </Col>
            </Row>

            <EditorsField vessel={vessel} />

            <Divider />

            <Form.Item>
                <SyrfFormButton disabled={!formChanged} type="primary" htmlType="submit">
                    {t(translations.vessel_create_update_page.save_vessel)}
                </SyrfFormButton>
            </Form.Item>
        </>
    )
}