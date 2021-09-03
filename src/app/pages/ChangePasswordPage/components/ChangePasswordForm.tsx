import * as React from 'react';
import { Form, Spin } from 'antd';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import {
    SyrfFormWrapper,
    SyrfSubmitButton,
    SyrfFormTitle,
    SyrfFieldLabel,
    SyrfPasswordInputField
} from 'app/components/SyrfForm';
import styled from 'styled-components';
import { useState } from 'react';
import { ProfileTabs } from './../../ProfilePage/components/ProfileTabs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { changePassword } from 'services/live-data-server/user';

export const ChangePasswordForm = (props) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();

    const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

    const onFinish = (values) => {
        const { oldPassword, newPassword } = values;

        setIsChangingPassword(true);

        const response: any = changePassword(newPassword);

        if (response.success) {
            toast.success(t(translations.change_password_page.password_changed_successfully));
            form.resetFields();
            setIsChangingPassword(false);
        } else if (response.error){
            toast.error(response.error.message);
            setIsChangingPassword(false);
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
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.change_password_page.old_password)}</SyrfFieldLabel>}
                            name="oldPassword"
                            rules={[{ required: true, max: 16, min: 8 }]}
                        >
                            <SyrfPasswordInputField />
                        </Form.Item>

                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.change_password_page.new_password)}</SyrfFieldLabel>}
                            name="newPassword"
                            rules={[{ required: true, max: 16, min: 8 }]}
                        >
                            <SyrfPasswordInputField />
                        </Form.Item>

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

                        <Form.Item>
                            <SyrfSubmitButton type="primary" htmlType="submit">
                                {t(translations.change_password_page.change_password)}
                            </SyrfSubmitButton>
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