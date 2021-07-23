import * as React from 'react';
import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';
import { BenefitCarousel } from './components/BenefitCarousel';
import { Footer } from './components/Footer';
import { PartnerAppCarousel } from './components/PartnerAppCarousel';
import { VideoSection } from './components/VideoSection';

export function AboutPage() {
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