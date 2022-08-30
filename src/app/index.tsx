/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalStyle } from '../styles/global-styles';

import * as React from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Layout } from 'antd';
import { media } from 'styles/media';
import styled from 'styled-components';

import { LoginPage } from './pages/LoginPage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { SignupPage } from './pages/SignupPage/Loadable';
import { HomePage } from './pages/HomePage/Loadable';
import { VerifyAccountPage } from './pages/VerifyAccountPage/Loadable';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage/Loadable';
import { PrivacyPage } from './pages/PrivacyPolicyPage/Loadable';
import { EULAPage } from './pages/EULAPage/Loadable';
import { AboutPage } from './pages/AboutPage/Loadable';
import { PlaybackPage } from './pages/PlaybackPage/Loadable';
import { CourseCreatePage } from './pages/CourseCreateUpdatePage/Loadable';
import { DataPage } from './pages/DataPage/Loadable';
import { MyEventPage } from './pages/MyEventPage/Loadable';
import { MyEventCreateUpdatePage } from './pages/MyEventCreateUpdatePage/Loadable';
import { CompetitionUnitCreateUpdatePage } from './pages/CompetitionUnitCreateUpdatePage/Loadable';
import { VesselListPage } from './pages/VesselListPage/Loadable';
import { VesselCreateUpdatePage } from './pages/VesselCreateUpdatePage/Loadable';
import { EventDetailPage } from './pages/EventDetailPage/Loadable';
import { MyTrackPage } from './pages/MyTrackPage/Loadable';
import { MyGroupsPage } from './pages/MyGroupPage/Loadable';
import { GroupDetailPage } from './pages/GroupDetailPage/Loadable';
import { GroupCreateUpdatePage } from './pages/GroupCreateUpdatePage/Loadable';
import { PublicProfilePage } from './pages/PublicProfilePage/Loadable';
import { ProfileSearchPage } from './pages/ProfileSearchPage/Loadable';
import { ExternalCredentialsManagePage } from './pages/ExternalCredentialsManagePage/Loadable';
import { LiveraftCreateUpdatePage } from './pages/LiferaftCreateUpdatePage/Loadable';
import { NotificationCenterPage } from './pages/NotificationCenterPage/Loadable';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage/Loadable';
import { SubscriptionPage } from './pages/SubscriptionPage/Loadable';
import { PaymentSucessPage } from './pages/PaymentSuccessPage/Loadable';

import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../app/pages/LoginPage/slice/selectors';
import { selectIsSiderToggled } from './components/SiderContent/slice/selectors';
import { UseLoginSlice } from './pages/LoginPage/slice';

import { SiderContent } from './components/SiderContent';
import { Header } from './components/Header';
import { StyleConstants } from 'styles/StyleConstants';
import { screenWidthIsGreaterThan1024 } from 'utils/helpers';
import { useSiderSlice } from './components/SiderContent/slice';
import { useState } from 'react';
import { TutorialModal } from './components/TutorialModal';
import { TourProvider } from '@reactour/tour';
import { steps } from 'utils/tour-steps';
import { initUserLocation } from 'utils/location';
import { AgreementModal } from './components/AgreementModal/AgreementModal';
import { selectIsSimplifiedPlayback } from './pages/PlaybackPage/components/slice/selectors';
import { EmailNotVerifiedPage } from './pages/EmailNotVerifiedPage/Loadable';


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

let siderToggled = true;

export function App(props) {

  const dispatch = useDispatch();

  const loginActions = UseLoginSlice().actions;

  const siderActions = useSiderSlice().actions;

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const isSiderToggled = useSelector(selectIsSiderToggled);

  const isSimplifiedPlayback = useSelector(selectIsSimplifiedPlayback);

  const [isDesktopSiderToggled, setIsDesktopSiderToggled] = useState<boolean>(true);

  const tourRef = React.useRef<any>();

  React.useEffect(() => {
    if (isAuthenticated) {
      dispatch(loginActions.getUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onWindowResize = () => {
    // reduce number of dispatch with siderToggled flag
    if (!screenWidthIsGreaterThan1024() && siderToggled) {
      siderToggled = false;
      dispatch(siderActions.setIsToggled(false));
    } else if (screenWidthIsGreaterThan1024() && !siderToggled) {
      siderToggled = true;
      dispatch(siderActions.setIsToggled(true));
      setIsDesktopSiderToggled(true);
    }
  }

  React.useEffect(() => {
    initUserLocation(handleInitUserLocationSuccess, () => { });
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInitUserLocationSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    if (latitude && longitude) {
      dispatch(loginActions.setUserCoordinate({ lat: latitude, lon: longitude }));
    }
  }

  const onSiderCollapsed = (collapsed) => {
    if (!screenWidthIsGreaterThan1024()) {
      dispatch(siderActions.setIsToggled(false));
    } else {
      setIsDesktopSiderToggled(!collapsed);
    }
  }

  const renderSider = () => {
    if (isAuthenticated && isSiderToggled && !isSimplifiedPlayback)
      return (
        <StyledSider
          collapsible
          onCollapse={onSiderCollapsed}
          width={256}
          style={{
            background: StyleConstants.MAIN_TONE_COLOR,
            zIndex: 99998
          }}
        >
          <SiderContent toggled={isDesktopSiderToggled} />
        </StyledSider>
      )
  }

  return (
    <BrowserRouter>
      <TourProvider beforeClose={() => {
        if (tourRef.current) {
          tourRef.current.dismissTour();
        }
      }} steps={steps}>
        <Layout style={{ minHeight: '100vh' }}>
          {!isSimplifiedPlayback && <Header />}
          <AgreementModal />
          {renderSider()}
          <Layout className="site-layout">
            <Content>
              <Switch>
                <Route exact path={process.env.PUBLIC_URL + '/'} component={HomePage} />
                <PublicRoute exact path={process.env.PUBLIC_URL + '/signin'} component={LoginPage} />
                <PublicRoute exact path={process.env.PUBLIC_URL + '/signup'} component={SignupPage} />
                <PublicRoute exact path={process.env.PUBLIC_URL + '/verify-account'} component={VerifyAccountPage} />
                <PublicRoute exact path={process.env.PUBLIC_URL + '/forgot-password'} component={ForgotPasswordPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/account'} component={ProfilePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/account/integrations'} component={ExternalCredentialsManagePage} />
                <Route exact path={process.env.PUBLIC_URL + '/privacy-policy'} component={PrivacyPage} />
                <Route exact path={process.env.PUBLIC_URL + '/eula'} component={EULAPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/data'} component={DataPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/events'} component={MyEventPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/events/create'} component={MyEventCreateUpdatePage} />
                <Route exact path={process.env.PUBLIC_URL + '/events/:eventId'} component={EventDetailPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/events/:eventId/update/'} component={MyEventCreateUpdatePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/events/:eventId/races/create'} component={CompetitionUnitCreateUpdatePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/events/:eventId/races/:competitionUnitId/update'} component={CompetitionUnitCreateUpdatePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/events/:eventId/courses/create'} component={CourseCreatePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/events/:eventId/courses/:courseId/update'} component={CourseCreatePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/boats/'} component={VesselListPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/boats/create'} component={VesselCreateUpdatePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/boats/:id/update'} component={VesselCreateUpdatePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/groups'} component={MyGroupsPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/groups/create'} component={GroupCreateUpdatePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/groups/:groupId/update'} component={GroupCreateUpdatePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/groups/:groupId/organization-connect'} component={GroupDetailPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/groups/:groupId'} component={GroupDetailPage} />
                <Route exact path={process.env.PUBLIC_URL + '/about'} component={AboutPage} />
                <Route exact path={process.env.PUBLIC_URL + '/playback'} component={PlaybackPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/tracks'} component={MyTrackPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/profile/search'} component={ProfileSearchPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/profile'} component={PublicProfilePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/profile/:profileId'} component={PublicProfilePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/boats/:boatId/liferafts/create'} component={LiveraftCreateUpdatePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/boats/:boatId/liferafts/:id/update'} component={LiveraftCreateUpdatePage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/notifications'} component={NotificationCenterPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/account/settings'} component={ProfileSettingsPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/account/subscription'} component={SubscriptionPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/payment-success'} component={PaymentSucessPage} />
                <PrivateRoute exact path={process.env.PUBLIC_URL + '/account-not-verified'} component={EmailNotVerifiedPage} />
                <Route component={NotFoundPage} />
              </Switch>
              <ToastContainer />
              <TutorialModal ref={tourRef} />
            </Content>
          </Layout>
        </Layout>
        <GlobalStyle />
      </TourProvider>
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
