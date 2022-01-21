import * as slice from '..';
import { ContainerState } from '../types';

describe('Home slice', () => {
  let state: ContainerState;

  beforeEach(() => {
    state = slice.initialState;
  });

  it('should return the initial state', () => {
    expect(slice.reducer(undefined, { type: '' })).toEqual(state);
  });

  it('should handle setTotal', () => {
    expect(
      slice.reducer(state, slice.homeActions.setTotal(10)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
        total: 10
    });
  });

  it('should handle setFromDate', () => {
    const fromDate = "2021-08-20";
    expect(
      slice.reducer(state, slice.homeActions.setFromDate(fromDate)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      fromDate: fromDate
    });
  });

  it('should handle setToDate', () => {
    const toDate = "2021-08-20";
    expect(
      slice.reducer(state, slice.homeActions.setToDate(toDate)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      toDate: toDate
    });
  });

  it('should handle setResults', () => {
    expect(
      slice.reducer(state, slice.homeActions.setResults([])),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      results: []
    });
  });

  it('should handle setKeyword', () => {
    expect(
      slice.reducer(state, slice.homeActions.setKeyword('keyword')),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      keyword: 'keyword'
    });
  });

  it('should handle setUpcomingRaces', () => {
    expect(
      slice.reducer(state, slice.homeActions.setUpcomingRaceResults([])),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      upcomingResults:[]
    });
  });

  it('should handle setUpComingResultPage', () => {
    expect(
      slice.reducer(state, slice.homeActions.setUpComingResultPage(1)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      upcomingResultPage:1
    });
  });

  it('should handle setUpComingResultPageSize', () => {
    expect(
      slice.reducer(state, slice.homeActions.setUpcomingResultPageSize(10)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      upcomingResultSize: 10
    });
  });

  it('should handle setUpComingResultPageSize', () => {
    expect(
      slice.reducer(state, slice.homeActions.setUpcomingResultTotal(100)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      upcomingResultTotal: 100
    });
  });

  it('should handle setUpcomingResultDuration', () => {
    expect(
      slice.reducer(state, slice.homeActions.setUpcomingResultDuration(1)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      upcomingResultDuration: 1
    });
  });

  it('should handle setUpcomingResultDistance', () => {
    expect(
      slice.reducer(state, slice.homeActions.setUpcomingResultDistance(5)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      upcomingResultDistance: 5
    });
  });
});
