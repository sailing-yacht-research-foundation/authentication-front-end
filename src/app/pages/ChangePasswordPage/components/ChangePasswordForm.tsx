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

export const ChangePasswordForm = (props) => {
    const [form] = Form.useForm();

    const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

    const onFinish = (values) => {
        const { oldPassword, newPassword } = values;

        setIsChangingPassword(true);
        Auth.currentAuthenticatedUser().then(user => {
            Auth.changePassword(user, oldPassword, newPassword).then(response => {
                toast.success('Password changed successfully');
                form.resetFields();
                setIsChangingPassword(false);
            }).catch(error => {
                toast.error(error.message);
                setIsChangingPassword(false);
            })
        }).catch(error => {
            toast.error(error.message);
            setIsChangingPassword(false);
        })
    }

    return (
        <Wrapper>
            <ProfileTabs />
            <SyrfFormWrapper style={{ marginTop: '50px'}}>
                <Spin spinning={isChangingPassword}>
                    <SyrfFormTitle>Change Your Password</SyrfFormTitle>
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
                            label={<SyrfFieldLabel>Old Password</SyrfFieldLabel>}
                            name="oldPassword"
                            rules={[{ required: true, max: 16, min: 8 }]}
                        >
                            <SyrfPasswordInputField />
                        </Form.Item>

                        <Form.Item
                            label={<SyrfFieldLabel>New Password</SyrfFieldLabel>}
                            name="newPassword"
                            rules={[{ required: true, max: 16, min: 8 }]}
                        >
                            <SyrfPasswordInputField />
                        </Form.Item>

                        <Form.Item>
                            <SyrfSubmitButton type="primary" htmlType="submit">
                                Change password
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