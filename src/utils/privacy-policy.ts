import { PrivacyPolicyInterface } from "types/PrivacyPolicy";

export const privacypolicyVersionsFilter = (versionList: PrivacyPolicyInterface[]): PrivacyPolicyInterface[] => {
  const sortedVersions = versionList.map((privacyPolicy) => {
    const versionNumber = privacyPolicy.version.split(".").map((v) => parseInt(v));

    return {
      ...privacyPolicy,
      versionNumber: versionNumber,
    };
  });

  sortedVersions.sort((a, b): any => {
    if (a.versionNumber[0] !== b.versionNumber[0]) {
      return a.versionNumber[0] - b.versionNumber[0];
    }

    if (a.versionNumber[1] !== b.versionNumber[1]) {
      return a.versionNumber[1] - b.versionNumber[1];
    }

    if (a.versionNumber[2] !== b.versionNumber[2]) {
      return a.versionNumber[2] - b.versionNumber[2];
    }
  });

  // Select last privacy policy
  return [sortedVersions[sortedVersions.length - 1]];
};
