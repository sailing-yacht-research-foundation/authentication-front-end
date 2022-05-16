/**
 * Asynchronously loads the component for PaymentSucessPage
 */

import * as React from 'react';
import { lazyLoad } from 'utils/loadable';
import { LoadingIndicator } from 'app/components/LoadingIndicator';

export const PaymentSucessPage = lazyLoad(
  () => import('./index'),
  module => module.PaymentSucessPage,
  {
    fallback: <LoadingIndicator />,
  },
);
