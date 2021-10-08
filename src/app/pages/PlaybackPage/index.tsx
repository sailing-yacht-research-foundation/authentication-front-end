import React, { useEffect, useRef, useState } from "react";
import queryString from "querystring";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { selectCompetitionUnitDetail, selectPlaybackType, selectSearchRaceDetail } from "./components/slice/selectors";
import { usePlaybackSlice } from "./components/slice";
import { PlaybackTypes } from "types/Playback";
import { IoIosArrowBack } from "react-icons/io";
import { Wrapper } from "app/components/SyrfGeneral";
import { useHistory, useLocation } from "react-router";
import { PlaybackScrapedRace } from "./components/PlaybackScrapedRace";
import { PlaybackStreamRace } from "./components/PlaybackStreamRace";
import { PlaybackInsecureScrapedRace } from "./components/PlaybackInsecureScrapedRace";
import { PlaybackRaceLoading } from "./components/PlaybackRaceLoading";
import { PlaybackRaceNotFound } from "./components/PlaybackRaceNotFound";
import { PlaybackOldRace } from "./components/PlaybackOldrace";

export const PlaybackPage = (props) => {
  const [raceIdentity, setRaceIdentity] = useState({ name: "SYRF", description: "" });
  const location = useLocation();
  const parsedQueryString: any = queryString.parse(
    location.search.includes("?") ? location.search.substring(1) : location.search
  );

  const dispatch = useDispatch();

  const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);
  const searchRaceData = useSelector(selectSearchRaceDetail);
  const playbackType = useSelector(selectPlaybackType);

  const headerInfoElementRef = useRef<any>();
  const contentContainerRef = useRef<any>();

  const { actions } = usePlaybackSlice();

  const history = useHistory();

  // Init detail
  useEffect(() => {
    if (parsedQueryString.raceId) dispatch(actions.getRaceData({ raceId: parsedQueryString.raceId }));

    return () => {
      dispatch(actions.setSearchRaceId(""));
      dispatch(actions.setSearchRaceDetail({}));
      dispatch(actions.setPlaybackType(PlaybackTypes.RACELOADING));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (playbackType === PlaybackTypes.SCRAPEDRACE) {
      if (searchRaceData.id) {
        setRaceIdentity({
          name: searchRaceData?.name,
          description: "",
        });
      }
    }

    if (playbackType === PlaybackTypes.STREAMINGRACE) {
      if (competitionUnitDetail.id) {
        setRaceIdentity({
          name: competitionUnitDetail?.name,
          description: "",
        });
      }
    }
  }, [competitionUnitDetail, searchRaceData, playbackType]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    handleResize();
  }, [raceIdentity]);

  const handleResize = () => {
    const { current } = headerInfoElementRef;
    if (!current) return;
    const headerElDimension = current.getBoundingClientRect();
    const headerElHeight = headerElDimension.height;
    const windowHeight = window.innerHeight;
    const navbarHeight = 73;

    const contentHeight = windowHeight - navbarHeight - headerElHeight;

    if (contentContainerRef.current) {
      contentContainerRef.current.style.height = `${contentHeight}px`;
    }
  };

  const handleHistoryGoBack = () => {
    history.goBack();
    const currentPathname = history.location.pathname;

    setTimeout(() => {
      if (currentPathname === window.location.pathname) history.goBack();
    }, 100);
  };

  return (
    <Wrapper>
      <PageHeadContainer>
        {history.action !== "POP" && (
          <GobackButton onClick={handleHistoryGoBack}>
            <IoIosArrowBack style={{ fontSize: "40px", color: "#1890ff" }} />
          </GobackButton>
        )}
        <div ref={headerInfoElementRef}>
          <PageInfoContainer>
            <PageHeading>{raceIdentity.name}</PageHeading> <PageDescription>{raceIdentity.description}</PageDescription>
          </PageInfoContainer>
        </div>
      </PageHeadContainer>

      <div ref={contentContainerRef}>
        {playbackType === PlaybackTypes.SCRAPEDRACE && <PlaybackScrapedRace />}
        {playbackType === PlaybackTypes.INSECURESCRAPEDRACE && <PlaybackInsecureScrapedRace />}
        {playbackType === PlaybackTypes.STREAMINGRACE && <PlaybackStreamRace />}
        {playbackType === PlaybackTypes.OLDRACE && <PlaybackOldRace />}
        {playbackType === PlaybackTypes.RACELOADING && <PlaybackRaceLoading />}
        {playbackType === PlaybackTypes.RACENOTFOUND && <PlaybackRaceNotFound />}
      </div>
    </Wrapper>
  );
};

const PageHeading = styled.h2`
  padding: 8px 16px;
  padding-bottom: 0px;
  margin-bottom: 0px;
`;

const PageHeadContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const PageInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageDescription = styled.p`
  padding: 0 16px;
  margin-bottom: 8px;
`;

const GobackButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
