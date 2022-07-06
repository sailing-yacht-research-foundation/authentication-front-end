import * as React from 'react';
import { Row } from 'antd';
import { Main } from './components/Main';

export const SubscriptionPage = () => {

  return (
    <Row justify="center" align="top" style={{ minHeight: '100vh', background: '#f7f7f9' }}>
      <Main/>
    </Row>
  );
}
