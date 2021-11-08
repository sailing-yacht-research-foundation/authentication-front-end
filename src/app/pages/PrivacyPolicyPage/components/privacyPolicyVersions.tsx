
import { PrivacyPolicyInterface } from 'types/PrivacyPolicy';
import { PrivacyPolicyV100 } from './privacyPolicyV100';

// Should be ascending based on version release
export const versionList: PrivacyPolicyInterface[] = [
  {
    key: 'privacy-policy-1.0.0',
    version: '1.0.0', // version should have three numbers like this
    releaseDate: new Date('November 2, 2021 00:00:00'),
    Component: PrivacyPolicyV100
  },
]