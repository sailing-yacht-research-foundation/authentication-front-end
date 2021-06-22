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
          <LinkStyled to="/signin">Log In</LinkStyled>
          <span style={{ marginLeft: '5px', marginRight: '5px' }}>|</span>
          <LinkStyled style={{ color: '#0C4983' }} to="/signup">Sign Up</LinkStyled>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
`;

const LinkStyled = styled(Link)`
  color:#599DF9;
  font-weight: 700;
`