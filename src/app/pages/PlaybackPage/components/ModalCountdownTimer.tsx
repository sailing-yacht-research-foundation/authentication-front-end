import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { Button, Modal } from "antd";
import moment from "moment";

import { timeMillisToHours } from "utils/time";
import { selectCompetitionUnitDetail, selectTimeBeforeRaceBegin } from "./slice/selectors";
import { usePlaybackSlice } from "./slice";
import { translations } from "locales/translations";
import { useHistory } from "react-router";
import { RaceStatus } from "utils/constants";

let intervalData;

export const ModalCountdownTimer = React.memo(() => {
  const dispatch = useDispatch();
  const { actions } = usePlaybackSlice();
  const competitionUnitDetail = useSelector(selectCompetitionUnitDetail);
  const timeBeforeRaceBegin = useSelector(selectTimeBeforeRaceBegin);
  const history = useHistory();

  const [composedTime, setComposedTime] = useState("00:00:00");

  const { t } = useTranslation();

  useEffect(() => {
    intervalData = setInterval(() => {
      dispatch(actions.getTimeBeforeRaceBegin({ raceStartTime: competitionUnitDetail?.startTime }));
    }, 1000);

    return () => {
      clearInterval(intervalData);
      dispatch(actions.setIsHavingCountdown(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetIntervalOnStartTimeChanged = () => {
    clearInterval(intervalData);
    intervalData = setInterval(() => {
      dispatch(actions.getTimeBeforeRaceBegin({ raceStartTime: competitionUnitDetail?.startTime }));
    }, 1000);
  }

  useEffect(() => {
    resetIntervalOnStartTimeChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [competitionUnitDetail])

  useEffect(() => {
    setComposedTime(timeMillisToHours(timeBeforeRaceBegin));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeBeforeRaceBegin]);

  // If race started
  if (!timeBeforeRaceBegin || timeBeforeRaceBegin <= 0) return null;
  const isMoreThen5Minutes = (timeBeforeRaceBegin && timeBeforeRaceBegin > 300000) || false;
  const renderedDate = moment(new Date(competitionUnitDetail?.startTime!)).format("LLLL");
  dispatch(actions.setIsHavingCountdown(true));

  const goBack = () => {
    if (history.action !== "POP") {
      history.goBack();
    } else {
      history.push('/');
    }
  }

  if (competitionUnitDetail.startTime
    && ![RaceStatus.COMPLETED, RaceStatus.CANCELED].includes(competitionUnitDetail.status)
    && !competitionUnitDetail.calendarEvent?.isSimulation)
    return (
      <div>
        <Container>
          <span>{t(translations.playback_page.countdown_timer_racewillstart)}</span>
          <span>
            <strong>{composedTime}</strong>
          </span>
        </Container>

        <Modal visible={isMoreThen5Minutes} footer={null} closable={false}>
          <ModalContainer>
            {t(translations.playback_page.countdown_timer_racewillstart)}
            <br />
            <TimerCountDown>{composedTime}</TimerCountDown>
            <br />
            <RaceStartAtText>
              {t(translations.playback_page.countdown_timer_on)} {renderedDate}
            </RaceStartAtText>
            <Button onClick={goBack} type="link">{t(translations.playback_page.go_back)}</Button>
          </ModalContainer>
        </Modal>
      </div>
    );

  return <></>;
});

const TimerCountDown = styled.span`
  font-size: 24px;
  font-weight: 500;
`;

const RaceStartAtText = styled.span`
  color: #999;
  font-size: 14px;
  display: block;
`;

const ModalContainer = styled.div`
  font-size: 16px;
  margin-bottom: 0px;
  text-align: center;
`;

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
