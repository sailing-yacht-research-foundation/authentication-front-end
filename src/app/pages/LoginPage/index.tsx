import * as React from 'react';
import { Row, Col } from 'antd';
import { LoginForm } from './components/LoginForm';
import { LeftPanel } from './components/LeftPanel';
import { Curtains } from "react-curtains";

export const LoginPage = () => {

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col lg={12} md={0} xs={0} sm={0}>
        <Curtains pixelRatio={Math.min(1.5, window.devicePixelRatio)}>
          <LeftPanel />
        </Curtains>
      </Col>
      <Col lg={12} md={24} xs={24} sm={24}>
        <LoginForm />
      </Col>
    </Row>
  );
}