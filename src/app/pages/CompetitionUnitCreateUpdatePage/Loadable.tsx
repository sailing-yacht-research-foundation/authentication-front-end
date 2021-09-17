/**
 * Asynchronously loads the component for CompetitionUnitCreateUpatePage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const CompetitionUnitCreateUpdatePage = lazyLoad(
   () => import('./index'),
   module => module.CompetitionUnitCreateUpdatePage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 