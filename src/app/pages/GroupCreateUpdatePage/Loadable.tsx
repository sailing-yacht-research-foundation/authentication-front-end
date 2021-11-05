/**
 * Asynchronously loads the component for GroupCreateUpdatePage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const GroupCreateUpdatePage = lazyLoad(
   () => import('./index'),
   module => module.GroupCreateUpdatePage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 