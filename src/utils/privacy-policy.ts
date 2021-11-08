import { PrivacyPolicyInterface } from "types/PrivacyPolicy";

export const privacypolicyVersionsFilter = (versionList: PrivacyPolicyInterface[]): PrivacyPolicyInterface[] => {
  const sortedVersions = versionList.map((privacyPolicy) => ({
    ...privacyPolicy,
    versionNumber: parseFloat(privacyPolicy.version.replaceAll(".", "")) / 100,
  }));
  sortedVersions.sort((a, b) => a.versionNumber - b.versionNumber);

  // Select last privacy policy
  return [sortedVersions[sortedVersions.length - 1]];
};
