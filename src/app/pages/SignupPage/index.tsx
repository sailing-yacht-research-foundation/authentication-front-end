import React from 'react';
import { Row } from 'antd';
import { SignupForm } from './components/SigninForm';

export const SignupPage = () => {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <SignupForm />
    </Row>
  );
}
