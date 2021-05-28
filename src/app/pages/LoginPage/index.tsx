import * as React from 'react';

import { Input, Form, Button, Row } from 'antd';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { UseLoginSlice } from './slice';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export function LoginPage(props) {
  const { actions } = UseLoginSlice();
  // Used to dispatch slice actions
  const dispatch = useDispatch();

  const onFinish = (values: any) => {
    let { email, password } = values;
    Auth.signIn({
      username: email,
      password
    }).then(user => {
      if (user.attributes && user.attributes.email_verified) {
        dispatch(actions.setAccessToken(user.signInUserSession?.accessToken?.jwtToken));
        dispatch(actions.setIsAuthenticated(true));
        props.history.push('/');
      }
    }).catch(error => {
      if (error.code === 'UserNotConfirmedException') {
        props.history.push('/verify-account', {
          state: {
            email: email
          }
        });
      }
    })
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
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Login
      </Button>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', }}>
            <a style={{ float: 'right' }} onClick={() => props.history.push('/signup')}>
              Signup
        </a>
            <a style={{ float: 'right' }}>
              Forgot password
      </a>
          </div>
        </Form.Item>
      </Form>
    </Row>
  );
}