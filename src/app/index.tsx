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
import classNames from 'classnames';

import { GlobalStyle } from '../styles/global-styles';

import { LoginPage } from './pages/LoginPage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { SignupPage } from './pages/SignupPage/Loadable';
import { HomePage } from './pages/HomePage/Loadable';
import { VerifyAccountPage } from './pages/VerifyAccountPage/Loadable';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage/Loadable';
import { ProfilePage } from './pages/ProfilePage/Loadable';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../app/pages/LoginPage/slice/selectors';

import Amplify from 'aws-amplify';
import config from '../aws-exports';

import { Layout } from 'antd';
import { SideMenu } from './components/SideMenu';
import { loginActions } from './pages/LoginPage/slice';
import { Header } from './components/Header';

const { Content } = Layout;
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

export function App(props) {
  const { i18n } = useTranslation();

  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  React.useEffect(() => {
    if (isAuthenticated)
      dispatch(loginActions.getUser());
  }, []);

  return (
    <BrowserRouter>
      <Layout className="site-layout">
        <Header/>
        { isAuthenticated && <SideMenu/> }
        <Content
          className={classNames({ 'site-content': isAuthenticated })}
        >
          <Switch>
            <Route exact path={process.env.PUBLIC_URL + '/'} component={HomePage} />
            <Route exact path={process.env.PUBLIC_URL + '/signin'} component={LoginPage} />
            <Route exact path={process.env.PUBLIC_URL + '/signup'} component={SignupPage} />
            <Route exact path={process.env.PUBLIC_URL + '/verify-account'} component={VerifyAccountPage} />
            <Route exact path={process.env.PUBLIC_URL + '/forgot-password'} component={ForgotPasswordPage} />
            <PrivateRoute exact path={process.env.PUBLIC_URL + '/profile/change-password'} component={ChangePasswordPage} />
            <PrivateRoute exact path={process.env.PUBLIC_URL + '/profile'} component={ProfilePage} />
            <Route component={NotFoundPage} />
          </Switch>
          <ToastContainer />
        </Content>
      </Layout>
      <GlobalStyle />
    </BrowserRouter>
  );
}
