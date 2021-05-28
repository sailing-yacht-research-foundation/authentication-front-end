import * as React from 'react';
import { Row } from 'antd';
import { LoginForm } from './components/LoginForm';

export const LoginPage = () => {

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <LoginForm />
    </Row>
  );
}