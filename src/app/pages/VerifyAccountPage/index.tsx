import * as React from 'react';

import { Input, Form, Button, Row } from 'antd';
import { Auth } from 'aws-amplify';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export function VerifyAccountPage(props) {

  React.useEffect(() => {
    if (!props.history?.location?.state?.state?.email) {
      props.history?.push('/not-found')
    }
  }, []);

  const onFinish = (values) => {
    const { code } = values;
    const email = props.history?.location?.state?.state?.email;
    try {
      Auth.confirmSignUp(email, code)
        .then(response => {
          props.history.push('/')
        }).catch(error => {
          console.log(error)
        })
    } catch (error) {

    }
  }

  const resendConfirmationCode = () => {
    const email = props.history?.location?.state?.state?.email;
    Auth.resendSignUp(email);
  }
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
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
    </Row>
  );
}
