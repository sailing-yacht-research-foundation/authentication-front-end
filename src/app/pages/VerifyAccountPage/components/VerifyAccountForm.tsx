import * as React from 'react';
import { Input, Form, Button, Spin } from 'antd';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { SyrfFormButton } from 'app/components/SyrfForm';

export const VerifyAccountForm = () => {
    const history = useHistory<any>();

    React.useEffect(() => {
        if (!history?.location?.state?.state?.email) {
            history?.push('/not-found')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish = (values) => {
        const { code } = values;
        const email = history?.location?.state?.state?.email;

        try {
            Auth.confirmSignUp(email, code)
                .then(response => {
                    history.push('/')
                }).catch(error => {
                    toast.error(error.message);
                })
        } catch (error) {

        }
    }

    const resendConfirmationCode = () => {
        const email = history?.location?.state?.state?.email;
        Auth.resendSignUp(email);
        toast.success('Confirmation code sent!');
    }

    return (
        <Form
            layout={'vertical'}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
        >
            <Form.Item
                label="Verification code"
                name="code"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item>
                <SyrfFormButton type="primary" htmlType="submit">
                    Verify my account
                </SyrfFormButton>
                <div style={{ marginTop: '10px', textAlign: 'right' }}>
                    <span> Could not receive the code? &nbsp; <a style={{ float: 'right' }} onClick={() => resendConfirmationCode()}>resend</a></span>
                </div>
            </Form.Item>
        </Form>
    );
}
