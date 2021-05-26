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
    <>
      <Helmet>
        <title>Verify your account</title>
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
