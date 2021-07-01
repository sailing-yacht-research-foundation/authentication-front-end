import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/macro';
import { SelectLanguage } from './components/SelectLanguage';
import { UserDropdown } from './components/UserDropdown';
import { Link } from 'react-router-dom';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import { media } from 'styles/media';
import { useHistory } from 'react-router';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import Auth from '@aws-amplify/auth';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export const Nav = () => {
  const isAuthenenticated = useSelector(selectIsAuthenticated);

  const dispatch = useDispatch();

  const loginActions = UseLoginSlice().actions;

  const history = useHistory();

  const { t, i18n } = useTranslation();

  const logout = () => {
    dispatch(loginActions.setLogout());
    history.push('/signin');
    Auth.signOut();
    localStorage.removeItem('access_token');
  }

  return (
    <Wrapper>
      {isAuthenenticated ? (
        <>
          <DropDownWrapper>
            <UserDropdown logout={logout} />
            <SelectLanguage />
          </DropDownWrapper>
          {isAuthenenticated &&
            <MobileMenuWrapper>
              <Space size={10}>
                <LinkStyled to="/" onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}>{t(translations.home_page.nav.user_dropdown.log_out)}</LinkStyled>
              </Space>
            </MobileMenuWrapper>}
        </>
      ) : (
        <>
          <LinkStyled to="/signin">{t(translations.home_page.nav.log_in)}</LinkStyled>
          <span style={{ marginLeft: '5px', marginRight: '5px' }}>|</span>
          <LinkStyled style={{ color: '#0C4983' }} to="/signup">{t(translations.home_page.nav.sign_up)}</LinkStyled>
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
`;

const DropDownWrapper = styled.div`
  display: none;

  ${media.medium`
    display: flex;
  `}
`;

export const MobileMenuWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  ${media.medium`
    display: none;
  `}
`;
