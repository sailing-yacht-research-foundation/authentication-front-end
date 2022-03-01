import * as React from 'react';
import { Row } from 'antd';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';

export const ForgotPasswordPage = () => {

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '0 15px' }}>
      <ForgotPasswordForm/>
    </Row>
  );
}
