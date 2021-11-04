
import { EulaInterface } from 'types/Eula';
import { PrivacyPolicyV100 } from './privacyPolicyV100';

// Should be ascending based on version release
export const versionList: EulaInterface[] = [
  {
    key: 'privacy-policy-1.0.0',
    versionNumber: 1.00,
    version: '1.0.0',
    releaseDate: new Date('November 2, 2021 00:00:00'),
    Component: PrivacyPolicyV100
  },
]