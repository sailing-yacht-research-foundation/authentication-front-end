import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import queryString from "querystring";
import { isMobile } from "react-device-detect";

import { PlaybackTypes } from "types/Playback";
import { selectSearchRaceDetail, selectPlaybackType } from "./slice/selectors";
import { checkIsForcedToInstallAppOnMobile } from "utils/race/race-helper";
import { PlaybackMobileIssue } from "./PlaybackMobileIssue";

export const PlaybackScrapedRace = (props) => {
  const location = useLocation();

  const playbackType = useSelector(selectPlaybackType);
  const searchRaceData = useSelector(selectSearchRaceDetail);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const parsedQueryString: any = queryString.parse(
    location.search.includes("?") ? location.search.substring(1) : location.search
  );

  useEffect(() => {
    handleDebug("=== Search Race Data ===");
    handleDebug(searchRaceData);
    handleDebug("========================");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchRaceData]);

  useEffect(() => {
    if (playbackType === PlaybackTypes.SCRAPEDRACE && isMobile) {
      if (checkIsForcedToInstallAppOnMobile(searchRaceData?.source)) {
        setIsModalVisible(true);
      };
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playbackType, searchRaceData])

  const handleDebug = (value) => {
    if (parsedQueryString?.dbg !== "true") return;
    console.log(value);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  }


  return (
    <div style={{ width: "100%", height: "100%" }}>
      <iframe title={searchRaceData?.name} style={{ height: "100%", width: "100%" }} src={searchRaceData?.url}></iframe>

      <Modal visible={isModalVisible} footer={null} closable onCancel={handleCloseModal}>
        <PlaybackMobileIssue onClickButton={handleCloseModal} />
      </Modal>
    </div>
  );
};
