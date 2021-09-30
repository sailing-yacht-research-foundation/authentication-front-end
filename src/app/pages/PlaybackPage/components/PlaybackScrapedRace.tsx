import React from "react";
import { useSelector } from "react-redux";
import { selectSearchRaceDetail } from "./slice/selectors";

export const PlaybackScrapedRace = (props) => {
  const searchRaceData = useSelector(selectSearchRaceDetail);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <iframe title={searchRaceData?.name} style={{ height: "100%", width: "100%" }} src={searchRaceData?.url}></iframe>
    </div>
  );
};
