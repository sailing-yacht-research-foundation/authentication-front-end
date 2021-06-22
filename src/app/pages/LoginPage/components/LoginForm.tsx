import * as React from 'react';

import { Input, Form, Button, Spin } from 'antd';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { UseLoginSlice } from '../slice';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const layout = {
  labelCol: { sm: 24, md: 8, lg: 6 },
  wrapperCol: { sm: 24, md: 16, lg: 18 }
};

const tailLayout = {
  wrapperCol: { offset: 6, sm: 24, md: 16, lg: 18 },
};

export const LoginForm = (props) => {
  const { actions } = UseLoginSlice();
  // Used to dispatch slice actions
  const dispatch = useDispatch();

  const history = useHistory();

  const [isSigningIn, setIsSigningIn] = React.useState<boolean>(false);

  const onFinish = (values: any) => {
    const { email, password } = values;

    setIsSigningIn(true);

    Auth.configure({ storage: localStorage });

    Auth.signIn({
      username: email,
      password
    }).then(user => {
      setIsSigningIn(false);

      if (user.attributes && user.attributes.email_verified) {
        dispatch(actions.setAccessToken(user.signInUserSession?.accessToken?.jwtToken));
        dispatch(actions.setIsAuthenticated(true));
        dispatch(actions.setUser(user));
        history.push('/');
      }
    }).catch(error => {
      setIsSigningIn(false);
      if (error.code) {
        if (error.code === 'UserNotConfirmedException') {
          history.push('/verify-account', {
            state: {
              email: email
            }
          });
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Cannot sign you in at the moment.");
      }
    })
  }

  return (
    <Spin spinning={isSigningIn} tip="Signing you in...">
      <Form
        {...layout}
        name="basic"
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

        <div style={{ textAlign: 'right' }}>
          <Link style={{ display: 'block', marginBottom: '20px' }} to="/forgot-password">Forgot password?</Link>
          <Button type="primary" htmlType="submit">
            Sign In
          </Button>
          <span style={{ textAlign: 'right', display: 'block', marginTop: '20px' }}>Don't have an account?&nbsp;
          <Link to="/signup">
            Sign Up
          </Link></span>
        </div>
      </Form>
    </Spin>
  );
}