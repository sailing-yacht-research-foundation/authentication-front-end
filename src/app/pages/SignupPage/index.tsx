import React from 'react';
import { Row } from 'antd';
import { SignupForm } from './components/SignupForm';
import { Curtains } from "react-curtains";
import { SimpleVideoPlane } from 'app/pages/AboutPage/components/SimpleVideoPlane';
import styled from 'styled-components';

export const SignupPage = () => {

  const [autoplaySupported, setAutoPlaySupported] = React.useState<boolean>(false);

  React.useEffect(() => {
    window.onscroll = function () {
      window.dispatchEvent(new Event('resize'));
    }

    Modernizr.on('videoautoplay', function (result) {
      if (result) {
        setAutoPlaySupported(true);
      } else {
        setAutoPlaySupported(false);
      }
    });

    return () => {
      window.onscroll = null;
    }
  }, []);

  return (
    <>
      {
        autoplaySupported ? (<Curtains pixelRatio={Math.min(1.5, window.devicePixelRatio)}>
          <CurtainPlaneWrapper>
            <SimpleVideoPlane />
          </CurtainPlaneWrapper>
        </Curtains>) : (<Background />)
      }
      <Row justify="center" align="middle" style={{ height: 'calc(100vh - 100px)', marginTop: '100px', padding: '0 15px' }}>
        <SignupForm />
      </Row>
    </>
  );
}

const CurtainPlaneWrapper = styled.div`
  position:fixed;
  padding:0;
  margin:0;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
`;

const Background = styled.div`
  position:fixed;
  padding:0;
  margin:0;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  background: url('/syrf-background.jpg');
`;
