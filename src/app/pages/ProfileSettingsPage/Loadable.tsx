/**
 * Asynchronously loads the component for ProfileSettingsPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const ProfileSettingsPage = lazyLoad(
   () => import('./index'),
   module => module.ProfileSettingsPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 
