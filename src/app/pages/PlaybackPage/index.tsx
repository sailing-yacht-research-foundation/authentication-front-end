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
import { PlaybackMobileIssue } from './components/PlaybackMobileIssue';
import { Share } from "./components/Share";
import { FullScreen } from './components/FullScreen';
import { translations } from "locales/translations";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const PlaybackPage = (props) => {
  const [raceIdentity, setRaceIdentity] = useState({ name: "SYRF", description: "", eventName: "", isTrackNow: false });
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
  const playbackContainerRef = useRef<any>();

  const { actions } = usePlaybackSlice();

  const history = useHistory();

  const { t } = useTranslation();

  // Init detail
  useEffect(() => {
    dispatch(actions.getRaceData({ raceId: parsedQueryString?.raceId }));

    return () => {
      dispatch(actions.setSearchRaceId(""));
      dispatch(actions.setSearchRaceDetail({}));
      dispatch(actions.setPlaybackType(PlaybackTypes.RACELOADING));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (parsedQueryString?.dbg === 'true') {
      console.log("=== SOURCE DATA ===");
      console.log({ competitionUnitDetail, searchRaceData, playbackType });
      console.log("===================");
    };
  }, [competitionUnitDetail, searchRaceData, playbackType, parsedQueryString]);

  useEffect(() => {
    if (playbackType === PlaybackTypes.SCRAPEDRACE) {
      if (searchRaceData.id) {
        setRaceIdentity({
          ...raceIdentity,
          name: searchRaceData?.name,
          description: "",
        });
      }
    }

    if (playbackType && [PlaybackTypes.STREAMINGRACE, PlaybackTypes.OLDRACE].includes(playbackType)) {
      if (competitionUnitDetail.id) {
        setRaceIdentity({
          name: competitionUnitDetail?.name,
          description: competitionUnitDetail?.description,
          eventName: competitionUnitDetail?.calendarEvent?.name,
          isTrackNow: competitionUnitDetail?.calendarEvent?.isPrivate
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (history.action !== "POP") {
      history.goBack();
    } else {
      history.push('/');
    }
  };

  return (
    <Wrapper ref={playbackContainerRef}>
      <PageHeadContainer>
        <GobackButton onClick={handleHistoryGoBack}>
          <IoIosArrowBack style={{ fontSize: "40px", color: "#1890ff" }} />
        </GobackButton>
        <div style={{ width: "100%" }} ref={headerInfoElementRef}>
          <PageInfoContainer>
            <PageHeadingContainer>
              <div>
                <PageHeading>{raceIdentity.name}</PageHeading>
                {raceIdentity.eventName && !raceIdentity.isTrackNow && <span><Link to={`/events/${competitionUnitDetail?.calendarEvent?.id}`}>{raceIdentity.eventName}</Link></span>}
                {raceIdentity.description && <PageDescription>{raceIdentity.description}</PageDescription>}
              </div>

              <PageHeadingRightContainer>
                {playbackType !== PlaybackTypes.RACELOADING
                  && playbackType !== PlaybackTypes.RACENOTFOUND
                  && (
                    <>
                      {!competitionUnitDetail?.calendarEvent?.isPrivate && <Share />}
                      <FullScreen container={playbackContainerRef} />
                    </>
                  )
                }
              </PageHeadingRightContainer>
            </PageHeadingContainer>
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
        {playbackType === PlaybackTypes.MOBILEISSUE && <PlaybackMobileIssue />}
      </div>
    </Wrapper>
  );
};

const PageHeading = styled.h2`
  padding-bottom: 0px;
  margin-bottom: 0px;
`;

const PageHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
`;

const PageHeadingRightContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PageHeadContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
`;

const PageInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageDescription = styled.p`
  padding: 0px;
  margin-bottom: 0px;
  margin-top: 8px;
`;

const GobackButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
