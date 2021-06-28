import React from 'react';
import { Row } from 'antd';
import { SignupForm } from './components/SignupForm';
import { StyleConstants } from 'styles/StyleConstants';

export const SignupPage = () => {
  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', marginTop: '100px', padding: '0 15px' }}>
      <SignupForm/>
    </Row>
  );
}
