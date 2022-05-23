import * as React from 'react';
import { Form, Modal, Spin, Tooltip } from 'antd';
import { toast } from 'react-toastify';
import {
    SyrfFormTitle,
    SyrfFieldLabel,
    SyrfPasswordInputField,
    SyrfFormButton,
    SyrfInputField,
} from 'app/components/SyrfForm';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { changeEmail } from 'services/live-data-server/user';
import { showToastMessageOnRequestError } from 'utils/helpers';
import styled from 'styled-components';

interface IChangeEmailModal {
    visible: boolean,
    hideModal: any
}

export const ChangeEmailModal = ({ visible, hideModal }: IChangeEmailModal) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();

    const [isChangingEmail, setIsChangingEmail] = useState<boolean>(false);

    const onFinish = async (values) => {
        const { newEmail, currentPassword } = values;

        setIsChangingEmail(true);
        const response: any = await changeEmail(currentPassword, newEmail);
        setIsChangingEmail(false);

        if (response.success) {
            toast.success(t(translations.settings_page.email_changed_successfully));
            form.resetFields();
            hideModal();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    return (
        <Modal onCancel={hideModal} visible={visible} footer={null}>
            <Spin spinning={isChangingEmail}>
                <SyrfFormTitle>{t(translations.settings_page.change_email)}</SyrfFormTitle>
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    onFinish={onFinish}
                    initialValues={{
                        newEmail: '',
                        currentPassword: '',
                        newEmailConfirmation: ''
                    }}
                >
                    <Tooltip title={t(translations.change_password_page.current_password)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.settings_page.please_input_your_current_password)}</SyrfFieldLabel>}
                            name="currentPassword"
                            data-tip={t(translations.change_password_page.current_password)}
                            rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }, {
                                pattern: /^\S+$/,
                                message: t(translations.misc.email_must_not_contain_blank)
                            }, { max: 16, min: 6, message: t(translations.forms.password_must_be_between) }]}
                        >
                            <SyrfPasswordInputField autoCapitalize="none" autoComplete="off" />
                        </Form.Item>
                    </Tooltip>

                    <Tooltip title={t(translations.tip.your_new_email)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.settings_page.new_email)}</SyrfFieldLabel>}
                            name="newEmail"
                            rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }, {
                                pattern: /^\S+$/,
                                message: t(translations.misc.email_must_not_contain_blank)
                            }, { max: 80, min: 8, message: t(translations.forms.new_email_must_be_between) }, {
                                type: 'email', message: t(translations.forms.email_must_be_valid)
                            }]}
                        >
                            <SyrfInputField autoCapitalize="none" autoComplete="off" />
                        </Form.Item>
                    </Tooltip>


                    <Tooltip title={t(translations.tip.confirm_new_email)}>
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.settings_page.confirm_new_email)}</SyrfFieldLabel>}
                            name="newEmailConfirmation"
                            rules={[
                                {
                                    required: true,
                                    message: t(translations.settings_page.please_confirm_you_new_email),
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newEmail') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error(t(translations.settings_page.the_two_emails_that_you_entered_do_not_match)));
                                    },
                                }),
                                {
                                    type: 'email', message: t(translations.forms.email_must_be_valid)
                                }]}
                        >
                            <SyrfInputField autoCapitalize="none" autoComplete="off" />
                        </Form.Item>
                    </Tooltip>

                    <SyrFieldDescription>{t(translations.settings_page.please_remember_that_once_the_email_changed_you_cannot_login_using_the_old_email)}</SyrFieldDescription>

                    <Form.Item>
                        <SyrfFormButton type="primary" htmlType="submit">
                            {t(translations.settings_page.change_email)}
                        </SyrfFormButton>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
}

export const SyrFieldDescription = styled.div`
    font-size: 13px;
    color: #00000073;
    margin-bottom: 15px;
`;