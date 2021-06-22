import * as React from 'react';
import { Row } from 'antd';
import { ChangePasswordForm } from './components/ChangePasswordForm';

export const ChangePasswordPage = (props) => {

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <ChangePasswordForm/>
    </Row>
  );
}
