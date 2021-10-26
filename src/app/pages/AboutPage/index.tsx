import { Wrapper } from 'app/components/SyrfGeneral';
import * as React from 'react';
import { BenefitCarousel } from './components/BenefitCarousel';
import { Footer } from './components/Footer';
import { VideoSection } from './components/VideoSection';
import { Curtains } from "react-curtains";

export function AboutPage() {
  return (
    <Curtains pixelRatio={Math.min(1.5, window.devicePixelRatio)}>
      <Wrapper>
        <VideoSection />
        <BenefitCarousel />
        <Footer />
      </Wrapper>
    </Curtains>
  );
}