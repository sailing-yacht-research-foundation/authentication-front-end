/**
 * Asynchronously loads the component for LiferaftCreateUpdatePage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const LiveraftCreateUpdatePage = lazyLoad(
   () => import('./index'),
   module => module.LiveraftCreateUpdatePage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 