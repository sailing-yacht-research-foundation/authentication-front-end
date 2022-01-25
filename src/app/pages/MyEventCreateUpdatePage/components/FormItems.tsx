import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Select, Switch, Row, Col } from 'antd';
import { SyrfFieldLabel, SyrfFormSelect, SyrfInputField, SyrfInputNumber } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { EventState, MODE } from 'utils/constants';
import { useLocation } from 'react-router-dom';

export const FormItems = (props) => {

    const { event, mode } = props;

    const { t } = useTranslation();

    const location = useLocation();

    const [participatingFee, setParticipatingFee] = React.useState<number>(0);

    const [isCrewed, setIsCrewed] = React.useState<boolean>(false);

    const participantFeeValid = participatingFee !== 0;

    const eventTypes = [
        { name: 'One Design', value: 'ONE_DESIGN' },
        { name: 'Kite Surfing', value: 'KITESURFING' },
        { name: 'Winging', value: 'WINGING' },
        { name: 'Wind Surfing', value: 'WINDSURFING' },
        { name: 'Cruising', value: 'CRUISING' },
        { name: 'Rally', value: 'RALLY' },
        { name: 'Training', value: 'TRAINING' },
        { name: 'Other', value: 'OTHER' },
    ];

    React.useEffect(() => {
        if (location.pathname.includes(MODE.CREATE)) {
            setIsCrewed(false);
            setParticipatingFee(0)
        } else {
            setIsCrewed(!!event.isCrewed);
            setParticipatingFee(!!event.participatingFee ? event.participatingFee : 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, event]);

    const renderEventTypesSelection = () => {
        return eventTypes.map((type, index) => <Select.Option key={index} value={type.value}>{type.name}</Select.Option>)
    }

    const renderParticipatingType = () => {
        return ['PERSON', 'VESSEL'].map((type, index) => <Select.Option key={index} value={type}>{type.toLowerCase()}</Select.Option>)
    }

    return (
        <>
            <Row gutter={12}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.event_type)}</SyrfFieldLabel>}
                        name="eventTypes"
                        data-tip={t(translations.tip.event_types)}
                    >
                        <SyrfFormSelect>
                            {renderEventTypesSelection()}
                        </SyrfFormSelect>
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.hashtag)}</SyrfFieldLabel>}
                        name="hashtag"
                        rules={[{ max: 255, message: t(translations.forms.please_input_no_more_than_255_characters) }]}
                    >
                        <SyrfInputField autoCorrect="off" />
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={12}>
                <Col xs={24} sm={24} md={participantFeeValid ? 12 : 24} lg={participantFeeValid ? 12 : 24}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.participanting_fee)}</SyrfFieldLabel>}
                        name="participatingFee">
                        <SyrfInputNumber
                            onChange={(value) => setParticipatingFee(Number(value))}
                            defaultValue={0}
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                    </Form.Item>
                </Col>

                {
                    participantFeeValid && <Col xs={24} sm={24} md={12} lg={12}><Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.participanting_fee_type)}</SyrfFieldLabel>}
                        name="participatingFeeType">
                        <SyrfFormSelect>
                            {renderParticipatingType()}
                        </SyrfFormSelect>
                    </Form.Item></Col>
                }
            </Row>

            <Row gutter={12}>
                <Col xs={12} sm={12} md={!isCrewed ? 8 : 4} lg={!isCrewed ? 8 : 4}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.require_covid_vaccination)}</SyrfFieldLabel>}
                        name="requireCovidCertificate"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={12} md={!isCrewed ? 8 : 4} lg={!isCrewed ? 8 : 4}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.is_crewed)}</SyrfFieldLabel>}
                        name="isCrewed"
                        valuePropName="checked"
                    >
                        <Switch onChange={value => setIsCrewed(value)} />
                    </Form.Item>
                </Col>
                {isCrewed && <>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.min_crew)}</SyrfFieldLabel>}
                            name="crewedMinValue"
                            rules={[({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value && Number(value) < getFieldValue('crewedMaxValue')) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t(translations.forms.min_crews_must_be_less_than_max_crews)));
                                },
                            })]}
                        >
                            <SyrfInputNumber />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.max_crew)}</SyrfFieldLabel>}
                            name="crewedMaxValue"
                            rules={[({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value && Number(value) > getFieldValue('crewedMinValue')) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t(translations.forms.max_crews_must_be_greater_than_min_crews)));
                                },
                            })]}
                        >
                            <SyrfInputNumber />
                        </Form.Item>
                    </Col>
                </>}
            </Row>

            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.require_certifications)}</SyrfFieldLabel>}
                name="requiredCertifications"
            >
                <SyrfInputField placeholder={t(translations.forms.please_input_in_commas_separated_format)}/>
            </Form.Item>

            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.external_url)}</SyrfFieldLabel>}
                name="externalUrl"
                className="event-external-website-step"
                data-tip={t(translations.tip.event_website)}
                rules={[{ type: 'url', message: t(translations.forms.external_url_is_not_a_valid_url) }]}
            >
                <SyrfInputField autoCorrect="off" />
            </Form.Item>
            

            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.open_regatta)}</SyrfFieldLabel>}
                name="isOpen"
                data-tip={t(translations.tip.regatta)}
                valuePropName="checked"
            >
                <Switch disabled={event.status !== EventState.DRAFT && mode !== MODE.CREATE} unCheckedChildren={'Invite Only'} checkedChildren={'Open Regatta'} />
            </Form.Item>
        </>
    )
}