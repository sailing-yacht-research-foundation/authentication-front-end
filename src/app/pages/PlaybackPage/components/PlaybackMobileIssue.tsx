import React from "react";
import { useSelector } from "react-redux";
import { isAndroid } from 'react-device-detect';
import Lottie from "react-lottie";
import { useTranslation } from "react-i18next";
import { Button } from 'antd';

import { urlToCompany } from "utils/url-to-company-map";
import { translations } from "locales/translations";
import { LottieWrapper } from "app/components/SyrfGeneral";
import { selectSearchRaceDetail } from "./slice/selectors";
import Insecure from "../assets/insecure.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: Insecure,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid",
  },
};

interface ButtonClickProperties {
  onClickButton?: Function;
};

export const PlaybackMobileIssue = (props: ButtonClickProperties) => {
  const { onClickButton } = props;
  const { t } = useTranslation();
  const searchRaceData = useSelector(selectSearchRaceDetail);

  const handleButtonClick = () => {
    if (onClickButton) onClickButton();
  };

  const appLink = isAndroid ? process.env.REACT_APP_DOWNLOAD_LINK_ANDROID : process.env.REACT_APP_DOWNLOAD_LINK_IOS;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
      }}
    >
      <LottieWrapper style={{ marginTop: "-40px" }}>
        <Lottie options={defaultOptions} height={280} width={280} />
        <h4 style={{ maxWidth: "800px", textAlign: "center", marginTop: "15px" }}>
          Unfortunately,&nbsp;
          {searchRaceData.source ||
            urlToCompany(searchRaceData.url) ||
            t(translations.playback_page.insecure_scraped_thisrace)}&nbsp;
          doesn’t let mobile users watch their races without installing their app. 
          <br /> <br />
          Next time, use SYRF’s LivePing app
          for universal, mobile friendly race tracking and playback. LivePing lets viewers watch the race from their
          browser, and is the only tracking app to #StopThePingParade.
        </h4>

        <Button style={{ marginTop: '8px' }} size="large" shape="round" block onClick={handleButtonClick} href={appLink} target="__blank">Download App</Button>
      </LottieWrapper>
    </div>
  );
};
