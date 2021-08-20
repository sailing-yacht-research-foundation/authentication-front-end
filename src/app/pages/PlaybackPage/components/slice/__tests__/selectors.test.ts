import * as selectors from '../selectors';
import { RootState } from 'types';
import { initialState } from '..';

describe('Playback selectors', () => {
  let state: RootState = {};

  beforeEach(() => {
    state = {};
  });

  it('should select the initial state', () => {
    expect(state).toEqual({});
  });

  it('should select elapsedTime', () => {
    state = {
      playback: { ...initialState, elapsedTime: 0 },
    };
    expect(selectors.selectElapsedTime(state)).toEqual(0);
  });

  it('should select raceLength', () => {
    const raceLength = 0;
    state = {
        playback: { ...initialState, raceLength: 0 },
    };
    expect(selectors.selectRaceLength(state)).toEqual(raceLength);
  });
});
