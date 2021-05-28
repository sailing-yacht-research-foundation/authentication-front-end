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

import { GlobalStyle } from '../styles/global-styles';

import { LoginPage } from './pages/LoginPage/Loadable';
import { NotFoundPage } from './pages/NotFoundPage/Loadable';
import { SignupPage } from './pages/SignupPage/Loadable';
import { HomePage } from './pages/HomePage/Loadable';
import { VerifyAccountPage } from './pages/VerifyAccountPage/Loadable';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../app/pages/LoginPage/slice/selectors';

import Amplify from 'aws-amplify';
import config from '../aws-exports';

import { Layout } from 'antd';
import { HeaderContent } from './components/HeaderContent';
import { SideMenu } from './components/SideMenu';

const { Header, Sider, Content } = Layout;
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
  return (
    <BrowserRouter>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ position: 'fixed', zIndex: 1, width: '100%', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'center' }}>
          <HeaderContent />
        </Header>
        <SideMenu />
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          <Switch>
            <PrivateRoute exact path={process.env.PUBLIC_URL + '/'} component={HomePage} />
            <Route exact path={process.env.PUBLIC_URL + '/signin'} component={LoginPage} />
            <Route exact path={process.env.PUBLIC_URL + '/signup'} component={SignupPage} />
            <Route exact path={process.env.PUBLIC_URL + '/verify-account'} component={VerifyAccountPage} />
            <Route exact path={process.env.PUBLIC_URL + '/forgot-pasword'} component={ForgotPasswordPage} />
            <Route component={NotFoundPage} />
          </Switch>
          <ToastContainer />
        </Content>
      </Layout>
      <GlobalStyle />
    </BrowserRouter>
  );
}
