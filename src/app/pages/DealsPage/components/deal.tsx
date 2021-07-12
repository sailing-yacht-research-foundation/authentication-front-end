import React from 'react';
import { Row } from 'antd';
import styled from 'styled-components';
import DealLogoSvg from '../assets/dummy-logo.svg';
import { StyleConstants } from 'styles/StyleConstants';
import { Link } from 'app/components/Link';
import { media } from 'styles/media';

export const Deals = () => {
  return (
    <Row justify="center" align="top" style={{ minHeight: '100vh', marginTop: '100px', padding: '0 20px' }}>
      <DealWrapper>
        <DealInnerwrapper>
          <DealLogo src={DealLogoSvg} />
          <DealText>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</DealText>
          <Link to="/">Checkout this deal!</Link>
        </DealInnerwrapper>

        <DealInnerwrapper>
          <DealLogo src={DealLogoSvg} />
          <DealText>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</DealText>
          <Link to="/deals">Checkout this deal!</Link>
        </DealInnerwrapper>

        <DealInnerwrapper>
          <DealLogo src={DealLogoSvg} />
          <DealText>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</DealText>
          <Link to="/deals">Checkout this deal!</Link>
        </DealInnerwrapper>

        <DealInnerwrapper>
          <DealLogo src={DealLogoSvg} />
          <DealText>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</DealText>
          <Link to="/deals">Checkout this deal!</Link>
        </DealInnerwrapper>

        <DealInnerwrapper>
          <DealLogo src={DealLogoSvg} />
          <DealText>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</DealText>
          <Link to="/deals">Checkout this deal!</Link>
        </DealInnerwrapper>
      </DealWrapper>
    </Row>
  )
}

const DealWrapper = styled.div`
    display: flex;
    justify-content:center;
    flex-direction: column;

    ${media.medium`
      flex-direction: row;
    `}
`;

const DealInnerwrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 255px;
  align-items:center;
`;

const DealText = styled.p`
  font-family: ${StyleConstants.FONT_OPEN_SANS}
  text-align: center;
  font-size: 14px;
  font-weight: 400px;
  line-height: 28px;
  color: #737475;
  text-align: center;
`;

const DealLogo = styled.img`
    margin: 0 15px;
    height: 100px;
`;