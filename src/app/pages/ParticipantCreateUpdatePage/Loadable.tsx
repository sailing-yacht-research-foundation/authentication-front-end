/**
 * Asynchronously loads the component for CompetitionUnitCreateUpatePage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const ParticipantCreateUpdatePage = lazyLoad(
   () => import('./index'),
   module => module.ParticipantCreateUpdatePage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 