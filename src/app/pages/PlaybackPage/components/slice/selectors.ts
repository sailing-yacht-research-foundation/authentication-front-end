import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "types";
import { initialState } from ".";

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.playback || initialState;

export const selectElapsedTime = createSelector(
  [selectDomain],
  (playbackState) => playbackState.elapsedTime
);

export const selectRaceLength = createSelector(
  [selectDomain],
  (playbackState) => playbackState.raceLength
);

export const selectCompetitionUnitId = createSelector(
  [selectDomain],
  (playbackState) => playbackState.competitionUnitId
);

export const selectCompetitionUnitDetail = createSelector(
  [selectDomain],
  (playbackState) => playbackState.competitionUnitDetail
);

export const selectVesselParticipants = createSelector(
  [selectDomain],
  (playbackState) => playbackState.vesselParticipants
);

export const selectIsPlaying = createSelector(
  [selectDomain],
  (playbackState) => playbackState.isPlaying
);
