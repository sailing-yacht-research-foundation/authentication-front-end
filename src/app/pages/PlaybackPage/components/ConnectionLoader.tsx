import React, { useEffect, useState } from 'react';
import Lottie from "react-lottie";
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { LottieMessage, LottieWrapper } from "app/components/SyrfGeneral";
import { selectIsConnecting } from './slice/selectors';
import { translations } from "locales/translations";
import LoadingConnection from '../assets/loading-connection.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: LoadingConnection,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid",
  },
};

export const ConnectionLoader = () => {
  const { t } = useTranslation();
  const isConnecting = useSelector(selectIsConnecting);

  return (
    <>
      {isConnecting && <ConnectionStatusContainer>
        <div>
          <LottieWrapper>
            <Lottie options={defaultOptions} height={400} width={200} />
            <LottieMessage>{t(translations.playback_page.connecting)}</LottieMessage>
          </LottieWrapper>
        </div>
      </ConnectionStatusContainer>}
    </>)
};

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