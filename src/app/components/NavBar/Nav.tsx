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
import { Space, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { AiFillPlusCircle } from 'react-icons/ai';

export const Nav = () => {
  const isAuthenenticated = useSelector(selectIsAuthenticated);

  const dispatch = useDispatch();

  const loginActions = UseLoginSlice().actions;

  const history = useHistory();

  const { t } = useTranslation();

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
          <StyledButtonCreate
            shape="round"
            size={'large'}
            icon={<AiFillPlusCircle
              style={{ marginRight: '5px' }}
              size={18} />} type="primary">
            {t(translations.home_page.nav.create)}
          </StyledButtonCreate>
          <DropDownWrapper>
            <UserDropdown logout={logout} />
            <SelectLanguage />
          </DropDownWrapper>
          <MobileMenuWrapper>
            <Space size={10}>
              <LinkStyled to="/" onClick={(e) => {
                e.preventDefault();
                logout();
              }}>{t(translations.about_page.nav.user_dropdown.log_out)}</LinkStyled>
            </Space>
          </MobileMenuWrapper>
        </>
      ) : (
        <>
          <AboutLink to="/about">{t(translations.about_page.nav.about)}</AboutLink>
          <Space size={15}>
            <div>
              <LinkStyled to="/signin">{t(translations.about_page.nav.log_in)}</LinkStyled>
              <span style={{ marginLeft: '5px', marginRight: '5px' }}>|</span>
              <LinkStyled style={{ color: '#0C4983' }} to="/signup">{t(translations.about_page.nav.sign_up)}</LinkStyled>
            </div>
            <SelectLanguage />
          </Space>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.nav`
  display: flex;
  z-index: 999;
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

const AboutLink = styled(LinkStyled)`
  visibility: hidden;

  ${media.medium`
     margin-right: 30px;
     margin-top: 2px;
     visibility: visible;
  `}
`;

const StyledButtonCreate = styled(Button)`
  display: none;
  ${media.medium`
    display: block;
    margin-right: 30px;
    margin-top: 13px;
  `}
`;