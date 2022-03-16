/**
 * Asynchronously loads the component for SubscriptionPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const SubscriptionPage = lazyLoad(
   () => import('./index'),
   module => module.SubscriptionPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 