import * as React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'app/components/Link';
import { NavBar } from 'app/components/NavBar';
import { Helmet } from 'react-helmet-async';
import { StyleConstants } from 'styles/StyleConstants';
import { Input, Form, Checkbox, Button } from 'antd';
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
    <>
      <Helmet>
        <title>Please Login</title>
        <meta name="description" content="Login" />
      </Helmet>
      <NavBar />
      <Wrapper>
        <Title>
        </Title>
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
