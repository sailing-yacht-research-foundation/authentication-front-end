/**
 * Asynchronously loads the component for PlaybackPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const PlaybackPage = lazyLoad(
   () => import('./index'),
   module => module.PlaybackPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 