/**
 * Asynchronously loads the component for NotificationCenterPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const NotificationCenterPage = lazyLoad(
   () => import('./index'),
   module => module.NotificationCenterPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 