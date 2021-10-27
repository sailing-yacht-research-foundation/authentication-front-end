import { Wrapper } from 'app/components/SyrfGeneral';
import * as React from 'react';
import { BenefitCarousel } from './components/BenefitCarousel';
import { Footer } from './components/Footer';
import { VideoSection } from './components/VideoSection';

export function AboutPage() {
  return (
      <Wrapper>
        <VideoSection />
        <BenefitCarousel />
        <Footer />
      </Wrapper>
  );
}