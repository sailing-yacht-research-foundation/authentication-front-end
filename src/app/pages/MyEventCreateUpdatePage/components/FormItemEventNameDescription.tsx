import React from 'react';
import { Form, Switch } from 'antd';
import { SyrfFieldLabel, SyrfInputField, SyrfTextArea } from 'app/components/SyrfForm';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export const FormItemEventNameDescription = () => {

    const { t } = useTranslation();

    return (
        <>
            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.name)}</SyrfFieldLabel>}
                name="name"
                className="event-name-step"
                data-tip={t(translations.tip.name_of_the_event)}
                rules={[{ required: true, message: t(translations.forms.event_name_is_required) },
                {
                    max: 150, message: t(translations.forms.event_name_must_not_be_longer_than_150_chars)
                }]}
            >
                <SyrfInputField autoCorrect="off" />
            </Form.Item>

            <Form.Item
                rules={[{ max: 255, message: t(translations.forms.event_description_must_not_be_longer_than_255_chars) }]}
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.description)}</SyrfFieldLabel>}
                name="description"
                className="event-description-step"
                data-multiline={true}
                data-tip={t(translations.tip.event_description)}
            >
                <SyrfTextArea autoCorrect="off" />
            </Form.Item>

            <Form.Item
                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.open_regatta)}</SyrfFieldLabel>}
                name="isOpen"
                data-tip={t(translations.tip.regatta)}
                valuePropName="checked"
            >
                <Switch />
            </Form.Item>

        </>
    )
}