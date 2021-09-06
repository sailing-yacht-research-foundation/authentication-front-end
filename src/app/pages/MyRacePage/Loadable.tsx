/**
 * Asynchronously loads the component for MyRacePage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const MyRacePage = lazyLoad(
   () => import('./index'),
   module => module.MyRacePage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 