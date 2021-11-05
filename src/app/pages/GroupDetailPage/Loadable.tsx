/**
 * Asynchronously loads the component for GroupDetailPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const GroupDetailPage = lazyLoad(
   () => import('./index'),
   module => module.GroupDetailPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 