/**
 * Asynchronously loads the component for CompetitionUnitListPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const CompetitionUnitListPage = lazyLoad(
   () => import('./index'),
   module => module.CompetitionUnitListPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 