/**
 * Asynchronously loads the component for CompetitionUnitListPage
 */

 import * as React from 'react';
 import { lazyLoad } from 'utils/loadable';
 import { LoadingIndicator } from 'app/components/LoadingIndicator';
 
 export const VesselParticipantGroupListPage = lazyLoad(
   () => import('./index'),
   module => module.VesselParticipantGroupListPage,
   {
     fallback: <LoadingIndicator />,
   },
 );
 