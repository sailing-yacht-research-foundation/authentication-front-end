/**
 * Asynchronously loads the component for DataPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const DataPage = lazyLoad(
   () => import('./index'),
   module => module.DataPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 