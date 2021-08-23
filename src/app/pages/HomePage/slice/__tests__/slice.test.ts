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
      from_date: fromDate
    });
  });

  it('should handle setToDate', () => {
    const toDate = "2021-08-20";
    expect(
      slice.reducer(state, slice.homeActions.setToDate(toDate)),
    ).toEqual<ContainerState>({
      ...slice.initialState,
      to_date: toDate
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
});
