/**
 * Asynchronously loads the component for NotFoundPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const ForgotPasswordPage = lazyLoad(
   () => import('./index'),
   module => module.ForgotPasswordPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 