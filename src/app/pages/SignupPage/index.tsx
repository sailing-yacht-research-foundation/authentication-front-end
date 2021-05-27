import React, { useState } from 'react';

import { Input, Form, Button, Row } from 'antd';

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
    </Row>
  );
}
