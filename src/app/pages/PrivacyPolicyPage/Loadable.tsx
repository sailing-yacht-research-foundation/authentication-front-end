
/**
 * Asynchronously loads the component for NotFoundPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const PrivacyPage = lazyLoad(
   () => import('./index'),
   module => module.PrivacyPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 