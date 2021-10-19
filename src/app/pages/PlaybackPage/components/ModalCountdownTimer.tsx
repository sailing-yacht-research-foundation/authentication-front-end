import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Modal } from "antd";
import moment from "moment";

import { timeMillisToHours } from "utils/time";
import { selectCompetitionUnitDetail, selectTimeBeforeRaceBegin } from "./slice/selectors";
import { usePlaybackSlice } from "./slice";
import { translations } from "locales/translations";

export const ModalCountdownTimer = React.memo(() => {
  const dispatch = useDispatch();
  const { actions } = usePlaybackSlice();
  const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);
  const timeBeforeRaceBegin = useSelector(selectTimeBeforeRaceBegin);

  const [composedTime, setComposedTime] = useState("00:00:00");

  const { t } = useTranslation();

  useEffect(() => {
    const intervalData = setInterval(() => {
      dispatch(actions.getTimeBeforeRaceBegin({ raceStartTime: competitionUnitDetail?.startTime }));
    }, 1000);

    return () => {
      clearInterval(intervalData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setComposedTime(timeMillisToHours(timeBeforeRaceBegin));
  }, [timeBeforeRaceBegin]);

  // If race started
  if (!timeBeforeRaceBegin || timeBeforeRaceBegin <= 0) return null;
  const isMoreThen5Minutes = (timeBeforeRaceBegin && timeBeforeRaceBegin > 300000) || false;
  const renderedDate = moment(new Date(competitionUnitDetail?.startTime)).format("LLLL");

  return (
    <div>
      <Container>
        <span>{t(translations.playback_page.countdown_timer_racewillstart)}</span>
        <span>
          <strong>{composedTime}</strong>
        </span>
      </Container>

      <Modal visible={isMoreThen5Minutes} footer={null} closable={false}>
        <p style={{ fontSize: "16px", marginBottom: "0px", textAlign: "center" }}>
          {t(translations.playback_page.countdown_timer_racewillstart)}
          <br />
          <span style={{ fontSize: "24px", fontWeight: 500 }}>{composedTime}</span>
          <br />
          <span style={{ color: "#999", fontSize: "14px" }}>
            {t(translations.playback_page.countdown_timer_on)} {renderedDate}
          </span>
        </p>
      </Modal>
    </div>
  );
});

const Container = styled.div`
  align-items: start;
  background-color: #00000088;
  border-radius: 8px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  padding: 4px 8px;
`;
