import * as React from 'react';
import { VerifyAccountForm } from './components/VerifyAccountForm';
import { Row } from 'antd';

export function VerifyAccountPage(props) {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '0 15px' }}>
      <VerifyAccountForm />
    </Row>
  );
}
