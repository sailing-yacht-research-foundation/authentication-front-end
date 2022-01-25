import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Select, Switch, Row, Col } from 'antd';
import { SyrfFieldLabel, SyrfFormSelect, SyrfInputField, SyrfInputNumber } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { EventState, MODE } from 'utils/constants';

export const FormItems = (props) => {

    const { event, mode, form } = props;

    const { t } = useTranslation();

    const [participatingFee, setParticipatingFee] = React.useState<number>(0);

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


    const renderEventTypesSelection = () => {
        return eventTypes.map((type, index) => <Select.Option key={index} value={type.value}>{type.name}</Select.Option>)
    }

    const renderParticipatingType = () => {
        return ['PERSON', 'VESSEL'].map((type, index) => <Select.Option key={index} value={type}>{type.toLowerCase()}</Select.Option>)
    }

    return (
        <>
            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.event_type)}</SyrfFieldLabel>}
                name="eventTypes"
                data-tip={t(translations.tip.event_types)}
            >
                <SyrfFormSelect>
                    {renderEventTypesSelection()}
                </SyrfFormSelect>
            </Form.Item>
            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.hashtag)}</SyrfFieldLabel>}
                name="hashtag"
                rules={[{ max: 255, message: t(translations.forms.please_input_no_more_than_255_characters) }]}
            >
                <SyrfInputField autoCorrect="off" />
            </Form.Item>

            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.participanting_fee)}</SyrfFieldLabel>}
                name="participatingFee">
                <SyrfInputNumber
                    onChange={(value) => setParticipatingFee(Number(value))}
                    defaultValue={0}
                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
            </Form.Item>

            {
                (participatingFee !== 0) && <Form.Item
                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.participanting_fee_type)}</SyrfFieldLabel>}
                    name="participatingFeeType">
                    <SyrfFormSelect>
                        {renderParticipatingType()}
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
                <Switch disabled={event.status !== EventState.DRAFT && mode !== MODE.CREATE} unCheckedChildren={'Invite Only'} checkedChildren={'Open Regatta'} />
            </Form.Item>
        </>
    )
}