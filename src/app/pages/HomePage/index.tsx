import * as React from 'react';
import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';
import { BenefitCarousel } from './components/BenefitCarousel';
import { Footer } from './components/Footer';
import { PartnerAppCarousel } from './components/PartnerAppCarousel';
import { VideoSection } from './components/VideoSection';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export function HomePage() {
  return (
    <Wrapper>
      <VideoSection/>
      <BenefitCarousel/>
      <PartnerAppCarousel/>
      <Footer/>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
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
