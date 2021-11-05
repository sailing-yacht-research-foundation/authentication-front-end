/**
 * Asynchronously loads the component for MyGroupsPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const MyGroupsPage = lazyLoad(
   () => import('./index'),
   module => module.MyGroupsPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 