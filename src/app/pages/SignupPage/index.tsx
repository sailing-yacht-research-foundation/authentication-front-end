import React from 'react';
import { Row, Col } from 'antd';
import { SignupForm } from './components/SignupForm';
import { Curtains } from "react-curtains";
import { LeftPanel } from '../LoginPage/components/LeftPanel';

export const SignupPage = () => {
  return (
    <Row justify="center" align="middle" style={{ maxHeight: 'calc(100vh - 100vh)', paddingTop: '100vh', padding: '0 15px' }}>
      <Col xl={12} lg={0} md={0} xs={0} sm={0}>
        <Curtains pixelRatio={Math.min(1.5, window.devicePixelRatio)}>
          <LeftPanel />
        </Curtains>
      </Col>
      <Col xl={12} lg={24} md={24} xs={24} sm={24}>
        <SignupForm />
      </Col>
    </Row>
  );
}
