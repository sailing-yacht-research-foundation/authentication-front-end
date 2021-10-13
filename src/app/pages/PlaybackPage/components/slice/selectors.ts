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

export const selectSearchRaceId = createSelector(
  [selectDomain],
  (playbackState) => playbackState.searchRaceId
)

export const selectSearchRaceDetail = createSelector(
  [selectDomain],
  (playbackState) => playbackState.searchRaceDetail
)

export const selectPlaybackType = createSelector(
  [selectDomain],
  (playbackState) => playbackState.playbackType
)

export const selectRaceSimplifiedTracks = createSelector(
  [selectDomain],
  (playbackState) => playbackState.raceSimplifiedTracks
)

export const selectRaceLegs = createSelector(
  [selectDomain],
  (playbackState) => playbackState.raceLegs
)

export const selectRaceCourseDetail = createSelector(
  [selectDomain],
  (playbackState) => playbackState.raceCourseDetail
)

export const selectRaceTime = createSelector(
  [selectDomain],
  (playbackState) => playbackState.raceTime
)

export const selectRaceRetrievedTimestamps = createSelector(
  [selectDomain],
  (playbackState) => playbackState.raceRetrievedTimestamps
)