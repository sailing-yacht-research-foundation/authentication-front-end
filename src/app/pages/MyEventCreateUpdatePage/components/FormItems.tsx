import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Select, Switch, Row, Col, Tooltip } from 'antd';
import { SyrfFieldLabel, SyrfFormSelect, SyrfInputField, SyrfInputNumber, SyrFieldDescription } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { certifications, EventState, EventTypes, MODE, requiredCompetitorsInformation } from 'utils/constants';
import { useLocation } from 'react-router-dom';
import { getValidOrganizableGroup } from 'services/live-data-server/groups';
import { ItemAvatar } from 'app/components/SyrfGeneral';
import { renderAvatar } from 'utils/user-utils';

export const FormItems = (props) => {

    const { event, mode, form } = props;

    const { t } = useTranslation();

    const location = useLocation();

    const [, setIsCrewed] = React.useState<boolean>(false);

    const [selectedOrganizerGroup, setSelectedOrganizerGroup] = React.useState<boolean>(false);

    const [validGroups, setValidGroups] = React.useState<any[]>([]);

    const [selectedEventType, setSelectedEventType] = React.useState<string>('');

    const [isPaidEvent, setIsPaidEvent] = React.useState<boolean>(false);

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

    const requiredFields = [
        {
            name: t(translations.my_event_list_page.emergency_contact),
            value: 'requireEmergencyContact',
        },
        {
            name: t(translations.my_event_list_page.covid_vaccination),
            value: 'requireCovidCertificate',
        },
        {
            name: t(translations.my_event_list_page.medical_problems),
            value: 'requireMedicalProblems'
        },
        {
            name: t(translations.my_event_list_page.food_allergies),
            value: 'requireFoodAllergies'
        },
        {
            name: t(translations.my_event_list_page.immigration_info),
            value: 'requireImmigrationInfo'
        }
    ]

    React.useEffect(() => {
        if (location.pathname.includes(MODE.CREATE)) {
            setIsCrewed(false);
            setSelectedOrganizerGroup(false);
            setIsPaidEvent(false);
            form.setFieldsValue({
                requiredFields: []
            })
        } else {
            setSelectedOrganizerGroup(!!event.organizerGroupId && event.participatingFee > 0);
            setIsCrewed(!!event.isCrewed);
            setSelectedEventType(event.eventTypes);
            setIsPaidEvent(event.participatingFee > 0);
            setRequiredFields();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, event]);

    const setRequiredFields = () => {
        const requiredFields: string[] = [];
        Object.keys(event).forEach(key => {
            if (requiredCompetitorsInformation.includes(key) && event[key] === true) {
                requiredFields.push(key);
            }
        });

        form.setFieldsValue({
            requiredFields
        })
    }

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

    const handleSetIsPaidEvent = (value) => {
        setIsPaidEvent(value);
        setSelectedOrganizerGroup(value);
    }

    const renderRequiredFields = () => {
        return requiredFields.map((field, index) => <Select.Option key={index} value={field.value}>{field.name}</Select.Option>)
    }

    return (
        <>
            <Row gutter={12}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Tooltip title={t(translations.tip.event_types)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.event_type)}</SyrfFieldLabel>}
                            name="eventTypes"
                        >
                            <SyrfFormSelect onChange={value => setSelectedEventType(String(value))}>
                                {renderEventTypesSelection()}
                            </SyrfFormSelect>
                        </Form.Item>
                    </Tooltip>
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
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.require_competitor_info)}</SyrfFieldLabel>}
                name="requiredFields"
            >
                <SyrfFormSelect maxTagCount={'responsive'} mode="multiple">
                    {renderRequiredFields()}
                </SyrfFormSelect>
            </Form.Item>

            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.free_or_paid)}</SyrfFieldLabel>}
                name="isPaidEvent"
                valuePropName="checked">
                <Switch
                    onChange={handleSetIsPaidEvent}
                    checkedChildren={t(translations.my_event_create_update_page.paid_event)}
                    unCheckedChildren={t(translations.my_event_create_update_page.free_event)} />

            </Form.Item>

            <Tooltip title={t(translations.tip.planning_organization_is_a_organization_has_connected_payout)}>
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.planning_organization)}</SyrfFieldLabel>}
                    name="organizerGroupId"
                    rules={[{ required: isPaidEvent, message: t(translations.forms.please_fill_out_this_field) }]}>
                    <SyrfFormSelect
                        allowClear
                        disabled={isPaidEvent && validGroups.length === 0}>
                        {renderValidOrganizerGroups()}
                    </SyrfFormSelect>
                </Form.Item>
                {isPaidEvent && validGroups.length === 0 ? <SyrFieldDescription style={{ position: 'relative', top: '-10px' }}>{t(translations.my_event_create_update_page.in_order_to_charge_for_your_events)}</SyrFieldDescription> : <></>}
            </Tooltip>

            {selectedOrganizerGroup &&
                <Row gutter={12}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.participanting_fee)}</SyrfFieldLabel>}
                            name="participatingFee"
                            rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }]}
                            help={t(translations.my_event_create_update_page.fee_paid_per_captain)}>
                            <SyrfInputNumber
                                defaultValue={0}
                                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
                            />
                        </Form.Item>
                    </Col>

                    {
                        <Col xs={24} sm={24} md={12} lg={12}><Form.Item
                            label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.participanting_fee_type)}</SyrfFieldLabel>}
                            rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }]}
                            name="participatingFeeType">
                            <SyrfFormSelect>
                                {renderParticipatingType()}
                            </SyrfFormSelect>
                        </Form.Item></Col>
                    }
                </Row>
            }

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

            <Tooltip title={t(translations.tip.event_website)}>
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.external_url)}</SyrfFieldLabel>}
                    name="externalUrl"
                    className="event-external-website-step"
                    rules={[{ type: 'url', message: t(translations.forms.external_url_is_not_a_valid_url) }]}
                >
                    <SyrfInputField autoCorrect="off" />
                </Form.Item>
            </Tooltip>

            <Tooltip title={t(translations.tip.regatta)}>
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.open_regatta)}</SyrfFieldLabel>}
                    name="isOpen"
                    valuePropName="checked"
                >
                    <Switch disabled={event.status !== EventState.DRAFT && mode !== MODE.CREATE} unCheckedChildren={'Invite Only'} />
                </Form.Item>
            </Tooltip>
        </>
    )
}