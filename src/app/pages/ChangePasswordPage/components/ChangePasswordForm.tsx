import * as React from 'react';
import { Form, Spin, Tooltip } from 'antd';
import { toast } from 'react-toastify';
import {
    SyrfFormWrapper,
    SyrfFormTitle,
    SyrfFieldLabel,
    SyrfPasswordInputField,
    SyrfFormButton
} from 'app/components/SyrfForm';
import styled from 'styled-components';
import { useState } from 'react';
import { ProfileTabs } from './../../ProfilePage/components/ProfileTabs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { changePassword } from 'services/live-data-server/user';
import { showToastMessageOnRequestError } from 'utils/helpers';

export const ChangePasswordForm = () => {

    const { t } = useTranslation();

    const [form] = Form.useForm();

    const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

    const onFinish = async (values) => {
        const { newPassword, currentPassword } = values;

        setIsChangingPassword(true);
        const response: any = await changePassword(currentPassword, newPassword);
        setIsChangingPassword(false);

        if (response.success) {
            toast.success(t(translations.change_password_page.password_changed_successfully));
            form.resetFields();
        } else {
            if (response.error.response?.data.errorCode === 401) {
                showToastMessageOnRequestError(response.error, t(translations.change_password_page.your_current_password_is_incorrect));
            } else {
                showToastMessageOnRequestError(response.error);
            }
        }
    }

    return (
        <Wrapper>
            <ProfileTabs />
            <SyrfFormWrapper style={{ marginTop: '50px' }}>
                <Spin spinning={isChangingPassword}>
                    <SyrfFormTitle>{t(translations.change_password_page.change_your_password)}</SyrfFormTitle>
                    <Form
                        form={form}
                        layout="vertical"
                        name="basic"
                        onFinish={onFinish}
                        initialValues={{
                            newPassword: '',
                            oldPassword: '',
                        }}
                    >
                        <Tooltip title={t(translations.change_password_page.current_password)}>
                            <Form.Item
                                label={<SyrfFieldLabel>{t(translations.change_password_page.current_password)}</SyrfFieldLabel>}
                                name="currentPassword"
                                data-tip={t(translations.change_password_page.current_password)}
                                rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }, {
                                    pattern: /^\S+$/,
                                    message: t(translations.misc.password_must_not_contain_blank)
                                }, { max: 16, min: 8, message: t(translations.forms.please_input_between, { min: 8, max: 16, field: 'Password' }) }]}
                            >
                                <SyrfPasswordInputField />
                            </Form.Item>
                        </Tooltip>

                        <Tooltip title={t(translations.tip.new_password)}>
                            <Form.Item
                                label={<SyrfFieldLabel>{t(translations.change_password_page.new_password)}</SyrfFieldLabel>}
                                name="newPassword"
                                rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }, {
                                    pattern: /^\S+$/,
                                    message: t(translations.misc.password_must_not_contain_blank)
                                }, { max: 16, min: 8, message: t(translations.forms.please_input_between, { min: 8, max: 16, field: 'New Password' }) }]}
                            >
                                <SyrfPasswordInputField />
                            </Form.Item>
                        </Tooltip>


                        <Tooltip title={t(translations.tip.password_confirmation)}>
                            <Form.Item
                                label={<SyrfFieldLabel>{t(translations.change_password_page.confirm_new_password)}</SyrfFieldLabel>}
                                name="newPasswordConfirmation"
                                rules={[
                                    {
                                        required: true,
                                        message: t(translations.change_password_page.please_confirm_new_password),
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error(t(translations.change_password_page.the_two_passwords_that_you_entered_do_not_match)));
                                        },
                                    }),
                                ]}
                            >
                                <SyrfPasswordInputField />
                            </Form.Item>
                        </Tooltip>

                        <Form.Item>
                            <SyrfFormButton type="primary" htmlType="submit">
                                {t(translations.change_password_page.change_password)}
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 132px;
    align-items: center;
    width: 100%;
`;
