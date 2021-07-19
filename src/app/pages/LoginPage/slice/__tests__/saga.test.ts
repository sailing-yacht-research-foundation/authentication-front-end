import { put, takeLatest } from 'redux-saga/effects';
import * as slice from '..';

import loginSaga, { getAuthUser } from '../saga';

describe('login Saga', () => {
  let getAuthUserIterator: ReturnType<typeof getAuthUser>;

  // We have to test twice, once for a successful load and once for an unsuccessful one
  // so we do all the stuff that happens beforehand automatically in the beforeEach
  beforeEach(() => {
    getAuthUserIterator = getAuthUser();
    const userDescriptor = getAuthUserIterator.next().value;
    expect(userDescriptor).toMatchSnapshot();
  });

  it('should set user if user is returned from call', () => {
    const user = {};
    const putDescriptor = getAuthUserIterator.next(user).value;
    expect(putDescriptor).toEqual(
      put(slice.loginActions.setUser({})),
    );

    const iteration = getAuthUserIterator.next();
    expect(iteration.done).toBe(true);
  });
});

describe('facebook Saga Init', () => {
  const facebookIterator = loginSaga();
  it('should start task to watch for getUser action', () => {
    const takeLatestDescriptor = facebookIterator.next().value;
    expect(takeLatestDescriptor).toEqual(
      takeLatest(slice.loginActions.getUser.type, getAuthUser),
    );
  });
});