import * as React from 'react';
import { Row, Col } from 'antd';
import { LoginForm } from './components/LoginForm';
import { LeftPanel } from './components/LeftPanel';

export const LoginPage = () => {

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col lg={13} md={13}>
        <LeftPanel />
      </Col>
      <Col lg={11} md={11}>
        <LoginForm />
      </Col>
    </Row>
  );
}