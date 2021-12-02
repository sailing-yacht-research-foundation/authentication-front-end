import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { SelectLanguage } from './components/SelectLanguage';
import { UserDropdown } from './components/UserDropdown';
import { Link, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, selectRefreshToken } from 'app/pages/LoginPage/slice/selectors';
import { media } from 'styles/media';
import { useHistory } from 'react-router';
import { UseLoginSlice } from 'app/pages/LoginPage/slice';
import { Space, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { AiFillPlusCircle } from 'react-icons/ai';
import ReactGA from 'react-ga4';
import { ExpeditionServerActionButtons } from 'app/pages/CompetitionUnitCreateUpdatePage/components/ExpeditionServerActionButtons';
import { selectLastSubscribedCompetitionUnitId } from 'app/pages/CompetitionUnitCreateUpdatePage/slice/selectors';
import { logout as ldsLogout } from 'services/live-data-server/auth';

const analycticsKey = process.env.REACT_APP_GOOGLE_ANALYTICS_KEY || '';

export const Nav = () => {
  const isAuthenenticated = useSelector(selectIsAuthenticated);

  const lastSubscribedCompetitionUnitId = useSelector(selectLastSubscribedCompetitionUnitId);

  const dispatch = useDispatch();

  const loginActions = UseLoginSlice().actions;

  const history = useHistory();

  const { t } = useTranslation();

  const location = useLocation();

  const refreshToken = useSelector(selectRefreshToken);

  const logout = async () => {
    await ldsLogout(refreshToken);
    dispatch(loginActions.setLogout());
    history.push('/signin');
  }

  const initGoogleAnalytic = () => {
    ReactGA.initialize(analycticsKey);
  }

  React.useEffect(() => {
    if (isAuthenenticated && analycticsKey) {
      initGoogleAnalytic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenenticated]);

  React.useEffect(() => {
    if (isAuthenenticated && analycticsKey) {
      ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <Wrapper>
      {isAuthenenticated ? (
        <>
          <StyledButtonCreate
            type="primary"
            shape="round"
            size="large"
            className="event-step"
            data-tip={t(translations.tip.host_a_new_event_with_races)}
            onClick={() => history.push("/events/create")} icon={<AiFillPlusCircle
              style={{ marginRight: '5px' }}
              size={18} />}>{t(translations.home_page.nav.create)}</StyledButtonCreate>
          {lastSubscribedCompetitionUnitId && <ExpeditionServerActionButtons competitionUnit={null} />}
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

  ${media.large`
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
  ${media.large`
    display: block;
    margin: 0 15px;
    margin-top: 13px;
  `}
`;