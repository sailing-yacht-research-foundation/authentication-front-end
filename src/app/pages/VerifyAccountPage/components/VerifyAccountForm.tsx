import * as React from 'react';
import { Input, Form } from 'antd';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { SyrfFormButton } from 'app/components/SyrfForm';

export const VerifyAccountForm = () => {
    const history = useHistory<any>();
    
    React.useEffect(() => {
        let code = new URLSearchParams(history.location.search).get("code");
        let email = new URLSearchParams(history.location.search).get("email");

        if (!history?.location?.state?.state?.email && !(code && email)) {
            history?.push('/not-found')
        } else if (code && email) {
            verifyAccount(email, code);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish = (values) => {
        const { code } = values;
        const email = history?.location?.state?.state?.email;

        verifyAccount(email, code);
    }

    const verifyAccount = (email, code) => {
        try {
            Auth.confirmSignUp(email, code)
                .then(response => {
                    history.push('/signin');
                    toast.success('Account verified, please login!');
                }).catch(error => {
                    toast.error(error.message);
                })
        } catch (error) {

        }
    }

    const resendConfirmationCode = () => {
        const email = history?.location?.state?.state?.email;
        
        Auth.resendSignUp(email).then(response => {
            toast.success('Confirmation code sent!');
        }).catch(error => {
            toast.error(error.message);
        })
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
                    <span> Could not receive the code? &nbsp; <a style={{ float: 'right' }} href="/" onClick={(e) => {
                        e.preventDefault();
                        resendConfirmationCode();
                    }}>resend</a></span>
                </div>
            </Form.Item>
        </Form>
    );
}
