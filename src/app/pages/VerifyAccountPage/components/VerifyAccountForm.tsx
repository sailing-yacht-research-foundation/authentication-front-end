import * as React from 'react';
import { Input, Form, Button, Spin } from 'antd';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export const VerifyAccountForm = () => {
    const history = useHistory<any>();

    React.useEffect(() => {
        if (!history?.location?.state?.state?.email) {
            history?.push('/not-found')
        }
    }, []);

    const onFinish = (values) => {
        const { code } = values;
        const email = history?.location?.state?.state?.email;
        try {
            Auth.confirmSignUp(email, code)
                .then(response => {
                    history.push('/')
                }).catch(error => {
                    console.log(error)
                })
        } catch (error) {

        }
    }

    const resendConfirmationCode = () => {
        const email = history?.location?.state?.state?.email;
        Auth.resendSignUp(email);
    }
    return (
        <Form
            {...layout}
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
            
            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                    Verify my account
                    </Button>
                <div style={{ clear: 'both' }}></div>
                <div style={{ marginTop: '10px' }}>
                    <span> Could not receive the code? <a style={{ float: 'right' }} onClick={() => resendConfirmationCode()}>resend</a></span>
                </div>
            </Form.Item>
        </Form>
    );
}
