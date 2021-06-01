import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import Auth from '@aws-amplify/auth';
import { SelectLanguage } from '../SelectLanguages'
import { Link } from 'react-router-dom';

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
      { isAuthenenticated ? (
        <>
          <SelectLanguage />
          <a href="/" onClick={(e) => {
            e.preventDefault();
            logout();
          }} style={{ marginLeft: '10px' }}>Sign Out</a>
        </>
      ) : (
        <>
          <Link to="/sigin">Sign in</Link>
          <span style={{ marginLeft: '5px', marginRight: '5px' }}>|</span>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
  margin-right: -1rem;
`;
