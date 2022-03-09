import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "types";
import { initialState } from ".";

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.login || initialState;

export const selectUser = createSelector(
  [selectDomain],
  (loginState) => loginState.user
);

export const selectIsAuthenticated = createSelector(
  [selectDomain],
  (loginState) => loginState.is_authenticated
);

export const selectIsSyrfServiceAuthenticated = createSelector(
  [selectDomain],
  (loginState) => loginState.syrf_authenticated
);

export const selectSessionToken = createSelector(
  [selectDomain],
  (loginState) => loginState.session_token
);

export const selectUserCoordinate = createSelector(
  [selectDomain],
  (loginState) => loginState.user_coordinate
);

export const selectRefreshToken = createSelector(
  [selectDomain],
  (loginState) => loginState.refresh_token
);

export const selectGetProfileAttemptsCount = createSelector(
  [selectDomain],
  (loginState) => loginState.get_profile_attempts_count
)

export const selectUserRole = createSelector(
  [selectDomain],
  (loginState) => loginState.role
)