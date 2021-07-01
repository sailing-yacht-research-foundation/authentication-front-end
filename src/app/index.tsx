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

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../app/pages/LoginPage/slice/selectors';
import { selectIsSiderToggled } from './components/SiderContent/slice/selectors';
import { UseLoginSlice } from './pages/LoginPage/slice';

import Amplify from 'aws-amplify';
import config from '../aws-exports';

import { SiderContent } from './components/SiderContent';
import { Header } from './components/Header';
import { StyleConstants } from 'styles/StyleConstants';
import { isMobile } from 'utils/helper';
import { useSiderSlice } from './components/SiderContent/slice';

const { Sider, Content } = Layout
Amplify.configure(config);

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
  const { i18n } = useTranslation();

  const dispatch = useDispatch();

  const loginActions = UseLoginSlice().actions;

  const siderActions = useSiderSlice().actions;

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const isSiderToggled = useSelector(selectIsSiderToggled);

  React.useEffect(() => {
    if (isAuthenticated)
      dispatch(loginActions.getUser());
  }, []);

  const onSiderCollapsed = () => {
    dispatch(siderActions.setIsToggled(false));
  }

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        {isAuthenticated && isSiderToggled  && <StyledSider
          collapsible={isMobile()}
          onCollapse={onSiderCollapsed}
          width={300}
          style={{
            background: StyleConstants.MAIN_TONE_COLOR,
            zIndex: 10
          }}
        >
          <SiderContent/>
        </StyledSider>
        }
        <Layout className="site-layout">
          <Content>
            <Switch>
              <PublicRoute exact path={process.env.PUBLIC_URL + '/'} component={HomePage} />
              <PublicRoute exact path={process.env.PUBLIC_URL + '/signin'} component={LoginPage} />
              <PublicRoute exact path={process.env.PUBLIC_URL + '/signup'} component={SignupPage} />
              <PublicRoute exact path={process.env.PUBLIC_URL + '/verify-account'} component={VerifyAccountPage} />
              <PublicRoute exact path={process.env.PUBLIC_URL + '/forgot-password'} component={ForgotPasswordPage} />
              <PrivateRoute exact path={process.env.PUBLIC_URL + '/profile/change-password'} component={ChangePasswordPage} />
              <PrivateRoute exact path={process.env.PUBLIC_URL + '/profile'} component={ProfilePage} />
              <Route exact path={process.env.PUBLIC_URL + '/privacy-policy'} component={PrivacyPage} />
              <Route exact path={process.env.PUBLIC_URL + '/eula'} component={EULAPage} />
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
`;