import * as React from 'react';
import { Row, Col } from 'antd';
import { LoginForm } from './components/LoginForm';
import { LeftPanel } from './components/LeftPanel';

export const LoginPage = () => {

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col lg={12} md={12} xs={0} sm={0}>
        <LeftPanel />
      </Col>
      <Col lg={12} md={12} xs={24} sm={24}>
        <LoginForm />
      </Col>
    </Row>
  );
}