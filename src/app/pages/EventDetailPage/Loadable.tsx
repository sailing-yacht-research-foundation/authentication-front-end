/**
 * Asynchronously loads the component for EventDetailPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const EventDetailPage = lazyLoad(
   () => import('./index'),
   module => module.EventDetailPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 