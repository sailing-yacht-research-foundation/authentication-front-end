import React from 'react';
import { useSelector } from "react-redux";
import { Redirect, Route } from 'react-router-dom';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';

export const PublicRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Route {...rest} render={(props) => (
      isAuthenticated === false
        ? <Component {...props} />
        : <Redirect to='/404' />
    )} />
  )
}

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const url = encodeURIComponent(window.location.pathname);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Route {...rest} render={(props) => (
      isAuthenticated === true
        ? <Component {...props} />
        : <Redirect to={`/signin?redirectBack=${url}`} />
    )} />
  )
}

