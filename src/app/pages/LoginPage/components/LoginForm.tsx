import * as React from 'react';

import { Input, Form, Button, Spin } from 'antd';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { UseLoginSlice } from '../slice';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const layout = {
  labelCol: { span: 6 },
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
            <Link to="/signup">
              Signup
            </Link>
            <Link to="/forgot-password">
              Forgot password
            </Link>
          </div>
        </Form.Item>
      </Form>
    </Spin>
  );
}