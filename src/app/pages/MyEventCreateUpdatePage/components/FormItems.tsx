import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Select, Switch, Row, Col } from 'antd';
import { SyrfFieldLabel, SyrfFormSelect, SyrfInputField, SyrfInputNumber } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { certifications, EventState, EventTypes, MODE } from 'utils/constants';
import { useLocation } from 'react-router-dom';
import { getValidOrganizableGroup } from 'services/live-data-server/groups';
import { ItemAvatar } from 'app/components/SyrfGeneral';
import { renderAvatar } from 'utils/user-utils';

export const FormItems = (props) => {

    const { event, mode } = props;

    const { t } = useTranslation();

    const location = useLocation();

    const [participatingFee, setParticipatingFee] = React.useState<number>(0);

    const [isCrewed, setIsCrewed] = React.useState<boolean>(false);

    const [selectedOrganizerGroup, setSelectedOrganizerGroup] = React.useState<boolean>(false);

    const participantFeeValid = participatingFee !== 0;

    const [validGroups, setValidGroups] = React.useState<any[]>([]);

    const [selectedEventType, setSelectedEventType] = React.useState<string>('');

    const eventTypes = [
        { name: 'One Design', value: 'ONE_DESIGN' },
        { name: 'Handicap Race', value: 'HANDICAP_RACE' },
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
            setParticipatingFee(0);
            setSelectedOrganizerGroup(false);
        } else {
            setSelectedOrganizerGroup(!!event.organizerGroupId)
            setIsCrewed(!!event.isCrewed);
            setParticipatingFee(!!event.participatingFee ? event.participatingFee : 0);
            setSelectedEventType(event.eventTypes);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, event]);

    const renderValidOrganizerGroups = () => {
        return validGroups.map((group, index) => <Select.Option key={index} value={group.id}>
            <ItemAvatar src={renderAvatar(group.groupImage)} />
            {group.groupName}
        </Select.Option>)
    }

    const renderEventTypesSelection = () => {
        return eventTypes.map((type, index) => <Select.Option key={index} value={type.value}>{type.name}</Select.Option>)
    }

    const renderParticipatingType = () => {
        return ['PERSON', 'VESSEL'].map((type, index) => <Select.Option key={index} value={type}>{type.toLowerCase()}</Select.Option>)
    }

    const getAllValidOrganizerGroups = async () => {
        const response = await getValidOrganizableGroup();

        if (response.success) {
            setValidGroups(response.data.groups);
        }
    }

    const renderCertificationsDropdownList = () => {
        return certifications.map((type, index) => <Select.Option key={index} value={type}>{type}</Select.Option>)
    }

    React.useEffect(() => {
        getAllValidOrganizerGroups();
    }, []);

    return (
        <>
            <Row gutter={12}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.event_type)}</SyrfFieldLabel>}
                        name="eventTypes"
                        data-tip={t(translations.tip.event_types)}
                    >
                        <SyrfFormSelect onChange={value => setSelectedEventType(String(value))}>
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

            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.planning_organization)}</SyrfFieldLabel>}
                name="organizerGroupId">
                <SyrfFormSelect onChange={value => setSelectedOrganizerGroup(!!value)}>
                    {renderValidOrganizerGroups()}
                </SyrfFormSelect>
            </Form.Item>

            {selectedOrganizerGroup &&
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
            }

            <Row gutter={12}>
                <Col xs={12} sm={12} md={!isCrewed ? 8 : 4} lg={!isCrewed ? 8 : 4}>
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.require_proof_of_covid_vaccination)}</SyrfFieldLabel>}
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

            {
                EventTypes.HANDICAP_RACE === selectedEventType && <Form.Item
                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.require_certificates)}</SyrfFieldLabel>}
                    name="requiredCertifications"
                >
                    <SyrfFormSelect mode="multiple">
                        {renderCertificationsDropdownList()}
                    </SyrfFormSelect>
                </Form.Item>
            }

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
                <Switch disabled={event.status !== EventState.DRAFT && mode !== MODE.CREATE} unCheckedChildren={'Invite Only'} />
            </Form.Item>
        </>
    )
}