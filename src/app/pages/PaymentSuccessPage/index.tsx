import * as React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'app/components/Link';
import { StyleConstants } from 'styles/StyleConstants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { LottieMessage, LottieWrapper } from 'app/components/SyrfGeneral';
import Lottie from 'react-lottie';
import PaymentSuccess from './assets/payment-success.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: PaymentSuccess,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export function PaymentSucessPage() {

  const { t } = useTranslation();

  return (
    <>
      <Wrapper>
        <LottieWrapper>
          <Lottie
            options={defaultOptions}
            height={400}
            width={400} />
          <LottieMessage>{t(translations.general.your_payment_has_been_successfully_completed)}</LottieMessage>
          <Link to={process.env.PUBLIC_URL + '/'}>{t(translations.not_found_page.return_to_homepage)}</Link>
        </LottieWrapper>
      </Wrapper>
    </>
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