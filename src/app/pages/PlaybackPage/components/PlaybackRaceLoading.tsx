import React from "react";
import Lottie from "react-lottie";
import { useTranslation } from "react-i18next";

import { LottieMessage, LottieWrapper } from "app/components/SyrfGeneral";
import { translations } from "locales/translations";
import LoadingRace from "../assets/loading-race.json";

export const PlaybackRaceLoading = (props) => {
  const { t } = useTranslation();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingRace,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid",
    },
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
      <LottieWrapper>
        <Lottie options={defaultOptions} height={280} width={280} />
        <LottieMessage>{t(translations.playback_page.getting_race_data)}</LottieMessage>
      </LottieWrapper>
    </div>
  );
};
