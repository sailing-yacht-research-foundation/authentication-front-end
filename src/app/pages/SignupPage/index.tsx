import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'app/components/Link';
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

export function SignupPage(props) {
  const [amplifyFeedBack, setAmplifyFeedBack] = useState({
    show: false,
    message: ''
  });

  const onFinish = (values) => {
    console.log(props);
    const { email, name, password } = values;
    Auth.signUp({
      username: email,
      password: password,
      attributes: {
        name: name
      }
    }).then(response => {
      let registerSuccess = !!response.user;
      if (registerSuccess) {
        props.history.push('/verify-account', {
          state: {
            email: response.user?.getUsername()
          }
        });
      }
    }).catch(err => {
      if (err.code) {
        setAmplifyFeedBack({
          show: true,
          message: err.message
        });
      }
    })
  }

  return (
    <>
      <Helmet>
        <title>Signup</title>
        <meta name="description" content="Signup" />
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
            label="Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            hasFeedback={amplifyFeedBack.show}
            help={amplifyFeedBack.message}
            rules={[{ required: true, max: 16, min: 8 }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Signup
            </Button>
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
