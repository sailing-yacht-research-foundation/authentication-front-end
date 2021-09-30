import React from "react";
import { useSelector } from "react-redux";
import { selectSearchRaceDetail } from "./slice/selectors";
import { urlToCompany } from "utils/url-to-company-map";
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";

export const PlaybackInsecureScrapedRace = (props) => {
  const { t } = useTranslation();
  const searchRaceData = useSelector(selectSearchRaceDetail);

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
      <h2 style={{ maxWidth: "800px", textAlign: "center" }}>
        {t(translations.playback_page.insecure_scraped_unfortunately)},&nbsp;
        {searchRaceData.source ||
          urlToCompany(searchRaceData.url) ||
          t(translations.playback_page.insecure_scraped_thisrace)}{" "}
        {t(translations.playback_page.insecure_scraped_nothttps)}
        &nbsp; <br /> <br />
        <a href={searchRaceData.url} rel="noreferrer" target="_blank">
          {t(translations.playback_page.insecure_scraped_clickhere)}
        </a>
        &nbsp;{t(translations.playback_page.insecure_scraped_viewinsecureplayer)}
      </h2>
    </div>
  );
};
