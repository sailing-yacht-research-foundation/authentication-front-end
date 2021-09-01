/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';

import * as React from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Layout } from 'antd';
import { media } from 'styles/media';
import styled from 'styled-components';

import { GlobalStyle } from '../styles/global-styles';

import { LoginPage } from './pages/LoginPage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { SignupPage } from './pages/SignupPage/Loadable';
import { HomePage } from './pages/HomePage/Loadable';
import { VerifyAccountPage } from './pages/VerifyAccountPage/Loadable';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage/Loadable';
import { ProfilePage } from './pages/ProfilePage/Loadable';
import { PrivacyPage } from './pages/PrivacyPolicyPage/Loadable';
import { EULAPage } from './pages/EULAPage/Loadable';
import { DealsPage } from './pages/DealsPage/Loadable';
import { AboutPage } from './pages/AboutPage/Loadable';
import { PlaybackPage } from './pages/PlaybackPage/Loadable';

import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../app/pages/LoginPage/slice/selectors';
import { selectIsSiderToggled } from './components/SiderContent/slice/selectors';
import { UseLoginSlice } from './pages/LoginPage/slice';

import { SiderContent } from './components/SiderContent';
import { Header } from './components/Header';
import { StyleConstants } from 'styles/StyleConstants';
import { isMobile } from 'utils/helpers';
import { useSiderSlice } from './components/SiderContent/slice';
import { useState } from 'react';

const { Sider, Content } = Layout;

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Route {...rest} render={(props) => (
      isAuthenticated === true
        ? <Component {...props} />
        : <Redirect to='/signin' />
    )} />
  )
}

const PublicRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Route {...rest} render={(props) => (
      isAuthenticated === false
        ? <Component {...props} />
        : <Redirect to='/404' />
    )} />
  )
}

export function App(props) {

  const dispatch = useDispatch();

  const loginActions = UseLoginSlice().actions;

  const siderActions = useSiderSlice().actions;

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const isSiderToggled = useSelector(selectIsSiderToggled);

  const [isDesktopSiderToggled, setIsDesktopSiderToggled] = useState<boolean>(true);

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(loginActions.getUser());
    }
    dispatch(loginActions.syrfServiceAnonymousLogin());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSiderCollapsed = (collapsed) => {
    if (isMobile()) {
      dispatch(siderActions.setIsToggled(false));
    } else {
      setIsDesktopSiderToggled(!collapsed);
    }
  }

  const renderSider = () => {
    if (isAuthenticated && isSiderToggled)
      return (
        <StyledSider
          collapsible
          onCollapse={onSiderCollapsed}
          width={256}
          style={{
            background: StyleConstants.MAIN_TONE_COLOR,
            zIndex: 9999
          }}
        >
          <SiderContent toggled={isDesktopSiderToggled} />
        </StyledSider>
      )
  }

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        {renderSider()}
        <Layout className="site-layout">
          <Content>
            <Switch>
              <Route exact path={process.env.PUBLIC_URL + '/'} component={HomePage} />
              <PublicRoute exact path={process.env.PUBLIC_URL + '/signin'} component={LoginPage} />
              <PublicRoute exact path={process.env.PUBLIC_URL + '/signup'} component={SignupPage} />
              <PublicRoute exact path={process.env.PUBLIC_URL + '/verify-account'} component={VerifyAccountPage} />
              <PublicRoute exact path={process.env.PUBLIC_URL + '/forgot-password'} component={ForgotPasswordPage} />
              <PrivateRoute exact path={process.env.PUBLIC_URL + '/profile/change-password'} component={ChangePasswordPage} />
              <PrivateRoute exact path={process.env.PUBLIC_URL + '/profile'} component={ProfilePage} />
              <Route exact path={process.env.PUBLIC_URL + '/privacy-policy'} component={PrivacyPage} />
              <Route exact path={process.env.PUBLIC_URL + '/eula'} component={EULAPage} />
              <PrivateRoute exact path={process.env.PUBLIC_URL + '/deals'} component={DealsPage} />
              <Route exact path={process.env.PUBLIC_URL + '/about'} component={AboutPage} />
              <Route exact path={process.env.PUBLIC_URL + '/playback'} component={PlaybackPage} />
              <Route component={NotFoundPage} />
            </Switch>
            <ToastContainer />
          </Content>
        </Layout>
      </Layout>
      <GlobalStyle />
    </BrowserRouter>
  );
}

const StyledSider = styled(Sider)`
  height: 100vh;
  position: fixed;

  ${media.medium`
    position: static;
  `}
`