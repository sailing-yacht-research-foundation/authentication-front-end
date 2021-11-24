import React, {useEffect, useState} from 'react';
import Lottie from "react-lottie";
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { LottieMessage, LottieWrapper } from "app/components/SyrfGeneral";
import { translations } from "locales/translations";
import LoadingConnection from '../assets/loading-connection.json';

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: LoadingConnection,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid",
  },
};

export const ConnectionLoader = React.memo(() => {
  const { t } = useTranslation();
  const [connecting, setConnecting] = useState<boolean|undefined>(true);

  useEffect(() => {
    setTimeout(() => {
      setConnecting(false);
    }, 1000);
  }, [])

  if (!connecting) return null;

  return (
    <ConnectionStatusContainer>
      <div>
        <LottieWrapper>
          <Lottie options={defaultOptions} height={400} width={200} />
          <LottieMessage>{t(translations.playback_page.connecting)}</LottieMessage>
        </LottieWrapper>
      </div>
    </ConnectionStatusContainer>
  )
});

const ConnectionStatusContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  left: 0px;
  background: #FFFFFFDD;
  z-index: 10001;
  justify-content: center;
  align-items: center;
`;
