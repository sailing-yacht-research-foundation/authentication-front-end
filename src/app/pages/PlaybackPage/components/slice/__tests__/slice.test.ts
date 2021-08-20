import * as slice from '..';
import { ContainerState } from '../types';

describe('Playback slice', () => {
  let state: ContainerState;

  beforeEach(() => {
    state = slice.initialState;
  });

  it('should return the initial state', () => {
    expect(slice.reducer(undefined, { type: '' })).toEqual(state);
  });

  it('should handle setRaceLength', () => {
    const raceLength = 110000;
    expect(
      slice.reducer(state, slice.playbackActions.setRaceLength(raceLength)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      raceLength: raceLength,
    });
  });

  it('should handle setElapsedTime', () => {
      const elapsedTime = 1000;
    expect(
      slice.reducer(state, slice.playbackActions.setElapsedTime(elapsedTime)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      elapsedTime: elapsedTime
    });
  });
});
