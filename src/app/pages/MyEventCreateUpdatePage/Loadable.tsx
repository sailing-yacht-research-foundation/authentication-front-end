/**
 * Asynchronously loads the component for MyRacePage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const MyEventCreateUpdatePage = lazyLoad(
   () => import('./index'),
   module => module.MyEventCreateUpdatePage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 