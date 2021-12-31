/**
 * Asynchronously loads the component for ExternalCredentialsManagePage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const ExternalCredentialsManagePage = lazyLoad(
   () => import('./index'),
   module => module.ExternalCredentialsManagePage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 
