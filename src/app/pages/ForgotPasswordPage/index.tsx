import * as React from 'react';
import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';
import { Row } from 'antd';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';

export const ForgotPasswordPage = (props) => {

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <ForgotPasswordForm/>
    </Row>
  );
}

const Wrapper = styled.div`
  height: calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT});
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 320px;
`;

const Title = styled.div`
  margin-top: -8vh;
  font-weight: bold;
  color: ${p => p.theme.text};
  font-size: 3.375rem;

  span {
    font-size: 3.125rem;
  }
`;
