import * as React from 'react';

import { Input, Form, Button, Spin } from 'antd';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { UseLoginSlice } from '../slice';
import { useHistory } from 'react-router';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const LoginForm = (props) => {
  const { actions } = UseLoginSlice();
  // Used to dispatch slice actions
  const dispatch = useDispatch();

  const history = useHistory();
  
  const [isSigningIn, setIsSigningIn] = React.useState<boolean>(false);

  const onFinish = (values: any) => {
    const { email, password } = values;

    setIsSigningIn(true)

    Auth.signIn({
      username: email,
      password
    }).then(user => {
      setIsSigningIn(false);

      if (user.attributes && user.attributes.email_verified) {
        dispatch(actions.setAccessToken(user.signInUserSession?.accessToken?.jwtToken));
        dispatch(actions.setIsAuthenticated(true));
        history.push('/');
      }
    }).catch(error => {
      setIsSigningIn(false);

      if (error.code === 'UserNotConfirmedException') {
        history.push('/verify-account', {
          state: {
            email: email
          }
        });
      }
    })
  }

  return (
    <Spin spinning={isSigningIn} tip="Signing you up...">
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
            <a style={{ float: 'right' }} onClick={() => history.push('/signup')}>
              Signup
            </a>
            <a style={{ float: 'right' }} onClick={() => history.push('/forgot-password')}>
              Forgot password
            </a>
          </div>
        </Form.Item>
      </Form>
    </Spin>
  );
}