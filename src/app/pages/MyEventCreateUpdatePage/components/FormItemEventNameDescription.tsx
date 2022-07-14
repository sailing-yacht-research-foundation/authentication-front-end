import React from 'react';
import { Form, Tooltip } from 'antd';
import { SyrfFieldLabel, SyrfInputField, SyrfTextArea } from 'app/components/SyrfForm';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { AssignAdminsFormItem } from './AssignAdminsFormItem';

export const FormItemEventNameDescription = (props) => {

    const { event } = props;

    const { t } = useTranslation();

    return (
        <>
            <Tooltip title={t(translations.tip.name_of_the_event)}>
                <Form.Item
                    label={<SyrfFieldLabel>{t(translations.general.name)}</SyrfFieldLabel>}
                    name="name"
                    rules={[{ required: true, message: t(translations.forms.event_name_is_required) },
                    {
                        max: 150, message: t(translations.forms.event_name_must_not_be_longer_than_150_chars)
                    }]}
                >
                    <SyrfInputField autoCorrect="off" />
                </Form.Item>
            </Tooltip>

            <Tooltip title={t(translations.tip.event_description)}>
                <Form.Item
                    rules={[{ max: 255, message: t(translations.forms.event_description_must_not_be_longer_than_255_chars) }]}
                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.description)}</SyrfFieldLabel>}
                    name="description"
                    data-multiline={true}
                >
                    <SyrfTextArea autoCorrect="off" />
                </Form.Item>
            </Tooltip>

            <AssignAdminsFormItem event={event} />
        </>
    )
}
