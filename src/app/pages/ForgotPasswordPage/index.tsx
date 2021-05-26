import * as React from 'react';
import styled from 'styled-components/macro';
import { NavBar } from 'app/components/NavBar';
import { Helmet } from 'react-helmet-async';
import { StyleConstants } from 'styles/StyleConstants';

import { Input, Form, Button } from 'antd';
import { Auth } from 'aws-amplify';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export function ForgotPasswordPage(props) {
  const [requestedResetPassword, setRequestedResetPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const onFinish = (values) => {
    const { email } = values;
    setEmail(email);
    sendForgotPasswordCode(email);
  }

  const sendForgotPasswordCode = (email) => {
    Auth.forgotPassword(email)
      .then(data => setRequestedResetPassword(true))
      .catch(err => console.log(err));
  }

  const onSubmitPasswordReset = (values) => {
    const { code, newPassword } = values;
    Auth.forgotPasswordSubmit(email, code, newPassword)
      .then(data => props.history?.push('/signin'))
      .catch(err => console.log(err))
  }

  return (
    <>
      <Helmet>
        <title>Recover password</title>
        <meta name="description" content="Login" />
      </Helmet>
      <NavBar />
      <Wrapper>
        <Title>
        </Title>
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
              rules={[{ required: true }]}
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
                <span> Could not receive the code? <a onClick={() => sendForgotPasswordCode(email)}>resend</a></span>
              </div>
            </Form.Item>
          </Form>
        )}
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  height: calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT});
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 320px;
`;

const Title = styled.div`
  margin-top: -8vh;
  font-weight: bold;
  color: ${p => p.theme.text};
  font-size: 3.375rem;

  span {
    font-size: 3.125rem;
  }
`;
