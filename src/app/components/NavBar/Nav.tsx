import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import Auth from '@aws-amplify/auth';

export function Nav() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { actions } = UseLoginSlice();
  const isAuthenenticated = useSelector(selectIsAuthenticated);

  const logout = () => {
    dispatch(actions.setLogout());
    history.push('/signin');
    Auth.signOut();
  }

  return (
    <Wrapper>
      { isAuthenenticated ? <a onClick={() => logout()}>Sign Out</a> : ''}
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
  margin-right: -1rem;
`;

const Item = styled.a`
  color: ${p => p.theme.primary};
  cursor: pointer;
  text-decoration: none;
  display: flex;
  padding: 0.25rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  align-items: center;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }

  .icon {
    margin-right: 0.25rem;
  }
`;
