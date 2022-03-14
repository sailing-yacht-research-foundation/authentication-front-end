import * as React from 'react';
import { Row } from 'antd';
import { ChangePasswordForm } from './components/ChangePasswordForm';

export const ChangePasswordPage = () => {

  return (
    <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
      <ChangePasswordForm/>
    </Row>
  );
}
