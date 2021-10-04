/**
 * Asynchronously loads the component for MyTrackPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const MyTrackPage = lazyLoad(
   () => import('./index'),
   module => module.MyTrackPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 