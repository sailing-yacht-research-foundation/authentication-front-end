import * as React from 'react';
import { Input, Form, Button, Row } from 'antd';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export function ForgotPasswordForm(props) {
  const [requestedResetPassword, setRequestedResetPassword] = React.useState(false);

  const [email, setEmail] = React.useState('');

  const history = useHistory();

  const onFinish = (values) => {
    const { email } = values;

    setEmail(email);
    sendForgotPasswordCode(email);
  }

  const sendForgotPasswordCode = (email) => {
    Auth.forgotPassword(email)
      .then(data => setRequestedResetPassword(true))
      .catch(err => toast.error(err.message));
  }

  const onSubmitPasswordReset = (values) => {
    const { code, newPassword } = values;
    Auth.forgotPasswordSubmit(email, code, newPassword)
      .then(data => {
        history.push('/signin')
        toast.success('Your password has been changed, you can login now.');
      })
      .catch(err => toast.error(err.message))
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      {!requestedResetPassword ? (
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Your email"
            name="email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
              Recover password
        </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onSubmitPasswordReset}
        >
          <Form.Item
            label="Code"
            name="code"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="New password"
            name="newPassword"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
              Change password
        </Button>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <div style={{ marginTop: '10px' }}>
              <span> Could not receive the code? <a href="/" onClick={(e) => {
                e.preventDefault();
                sendForgotPasswordCode(email);
              }}>resend</a></span>
            </div>
          </Form.Item>
        </Form>
      )}
    </Row>
  );
}