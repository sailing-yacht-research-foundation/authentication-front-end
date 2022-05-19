/**
 * Asynchronously loads the component for EmailNotVefiedPage
 */

import * as React from 'react';
import { lazyLoad } from 'utils/loadable';
import { LoadingIndicator } from 'app/components/LoadingIndicator';

export const EmailNotVefiedPage = lazyLoad(
  () => import('./index'),
  module => module.EmailNotVefiedPage,
  {
    fallback: <LoadingIndicator />,
  },
);
