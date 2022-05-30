/**
 * Asynchronously loads the component for EmailNotVerifiedPage
 */

import * as React from 'react';
import { lazyLoad } from 'utils/loadable';
import { LoadingIndicator } from 'app/components/LoadingIndicator';

export const EmailNotVerifiedPage = lazyLoad(
  () => import('./index'),
  module => module.EmailNotVerifiedPage,
  {
    fallback: <LoadingIndicator />,
  },
);
