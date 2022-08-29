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
                    rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) },
                    {
                        max: 150, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 150 })
                    }]}
                >
                    <SyrfInputField />
                </Form.Item>
            </Tooltip>

            <Tooltip title={t(translations.tip.event_description)}>
                <Form.Item
                    rules={[{ max: 1000, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 1000 }) }]}
                    label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.description)}</SyrfFieldLabel>}
                    name="description"
                    data-multiline={true}
                >
                    <SyrfTextArea />
                </Form.Item>
            </Tooltip>

            <AssignAdminsFormItem event={event} />
        </>
    )
}
