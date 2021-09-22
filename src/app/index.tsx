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
import { CourseCreatePage } from './pages/CourseCreateUpdatePage/Loadable';
import { DataPage } from './pages/DataPage/Loadable';
import { MyEventPage } from './pages/MyEventPage/Loadable';
import { MyEventCreateUpdatePage } from './pages/MyEventCreateUpdatePage/Loadable';
import { CompetitionUnitCreateUpdatePage } from './pages/CompetitionUnitCreateUpdatePage/Loadable';
import { CompetitionUnitListPage } from './pages/CompetitionUnitListPage/Loadable';
import { VesselListPage } from './pages/VesselListPage/Loadable';
import { VesselCreateUpdatePage } from './pages/VesselCreateUpdatePage/Loadable';
import { ParticipantCreateUpdatePage } from './pages/ParticipantCreateUpdatePage/Loadable';
import { VesselParticipantGroupPage } from './pages/VesselParticipantGroupCreateUpdatePage/Loadable';
import { VesselParticipantGroupListPage } from './pages/VesselParticipantGroupListPage/Loadable';

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
    } else {
      dispatch(loginActions.syrfServiceAnonymousLogin());
    }
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
          className="fadeIn"
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
              <Route exact path={process.env.PUBLIC_URL + '/verify-account'} component={VerifyAccountPage} />
              <PublicRoute exact path={process.env.PUBLIC_URL + '/forgot-password'} component={ForgotPasswordPage} />
              <PrivateRoute exact path={process.env.PUBLIC_URL + '/profile/change-password'} component={ChangePasswordPage} />
              <PrivateRoute exact path={process.env.PUBLIC_URL + '/profile'} component={ProfilePage} />
              <Route exact path={process.env.PUBLIC_URL + '/privacy-policy'} component={PrivacyPage} />
              <Route exact path={process.env.PUBLIC_URL + '/eula'} component={EULAPage} />
              <PrivateRoute exact path={process.env.PUBLIC_URL + '/deals'} component={DealsPage} />
              <PrivateRoute exact path={process.env.PUBLIC_URL + '/data'} component={DataPage} />
              <Route exact path={process.env.PUBLIC_URL + '/events'} component={MyEventPage}/>
              <Route exact path={process.env.PUBLIC_URL + '/events/create'} component={MyEventCreateUpdatePage}/>
              <Route exact path={process.env.PUBLIC_URL + '/events/:eventId/update/'} component={MyEventCreateUpdatePage}/>
              <Route exact path={process.env.PUBLIC_URL + '/events/:eventId/races/create'} component={CompetitionUnitCreateUpdatePage}/>
              <Route exact path={process.env.PUBLIC_URL + '/events/:eventId/races/:competitionUnitId/update'} component={CompetitionUnitCreateUpdatePage}/>
              <Route exact path={process.env.PUBLIC_URL + '/races/create'} component={CompetitionUnitCreateUpdatePage}/>
              <Route exact path={process.env.PUBLIC_URL + '/races'} component={CompetitionUnitListPage}/>
              <Route exact path={process.env.PUBLIC_URL + '/races/:competitionUnitId/courses/create'} component={CourseCreatePage} />
              <Route exact path={process.env.PUBLIC_URL + '/races/:competitionUnitId/courses/:courseId/update'} component={CourseCreatePage} />
              <Route exact path={process.env.PUBLIC_URL + '/vessels/'} component={VesselListPage} />
              <Route exact path={process.env.PUBLIC_URL + '/vessels/create'} component={VesselCreateUpdatePage} />
              <Route exact path={process.env.PUBLIC_URL + '/vessels/:id/update'} component={VesselCreateUpdatePage} />
              <Route exact path={process.env.PUBLIC_URL + '/events/:eventId/participants/create'} component={ParticipantCreateUpdatePage}/>
              <Route exact path={process.env.PUBLIC_URL + '/events/:eventId/participants/:id/update'} component={ParticipantCreateUpdatePage}/>
              <Route exact path={process.env.PUBLIC_URL + '/vessel-participant-groups/create'} component={VesselParticipantGroupPage}/>
              <Route exact path={process.env.PUBLIC_URL + '/vessel-participant-groups/:id/update'} component={VesselParticipantGroupPage}/>
              <Route exact path={process.env.PUBLIC_URL + '/vessel-participant-groups'} component={VesselParticipantGroupListPage}/>
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