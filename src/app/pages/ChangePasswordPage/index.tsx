import * as React from 'react';
import { Row } from 'antd';
import { ChangePasswordForm } from './components/ChangePasswordForm';

export const ChangePasswordPage = (props) => {

  return (
    <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#E5E5E5' }}>
      <ChangePasswordForm/>
    </Row>
  );
}
