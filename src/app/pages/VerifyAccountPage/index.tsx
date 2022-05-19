import * as React from 'react';
import { VerifyAccountForm } from './components/VerifyAccountForm';
import { Row } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';

export function VerifyAccountPage(props) {

  const history = useHistory();

  const location = useLocation();

  const email = (new URLSearchParams(location.search).get('email'));

  React.useEffect(() => {
    if (!email) history.push('/404');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', padding: '0 15px' }}>
      <VerifyAccountForm email={email} />
    </Row>
  );
}
