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
  const translate = {
    unfortunately: t(translations.playback_page.unfortunately),
    watch_without_app: t(translations.playback_page.watch_without_app_installation),
    next_time: t(translations.playback_page.next_time),
    liveping_lets_viewers: t(translations.playback_page.live_ping_lets_viewers),
    insecure: t(translations.playback_page.insecure_scraped_thisrace)
  };

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
          {translate.unfortunately}&nbsp;
          
          { searchRaceData.source ||
            urlToCompany(searchRaceData.url) || translate.insecure }&nbsp;
          
          {translate.watch_without_app}

          <br /> <br />
          
          {translate.next_time} 
          {translate.liveping_lets_viewers}
        </h4>

        <Button style={{ marginTop: '8px' }} size="large" shape="round" block onClick={handleButtonClick} href={appLink} target="__blank">Download App</Button>
      </LottieWrapper>
    </div>
  );
};
