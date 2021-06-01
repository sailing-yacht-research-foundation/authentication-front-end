import * as React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SelectLanguage } from './components/SelectLanguage';
import { UserDropdown } from './components/UserDropdown';
import { Link } from 'react-router-dom';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';

export const Nav = () => {
  const isAuthenenticated = useSelector(selectIsAuthenticated);

  return (
    <Wrapper>
      { isAuthenenticated ? (
        <>
          <UserDropdown/>
          <SelectLanguage />
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
