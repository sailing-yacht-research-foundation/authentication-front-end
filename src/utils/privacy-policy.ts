import { PrivacyPolicyInterface } from "types/PrivacyPolicy";

export const privacypolicyVersionsFilter = (currentVersion: string, versionList: PrivacyPolicyInterface[]): PrivacyPolicyInterface[] => {
  // Select aggreed version and last eula
  if (currentVersion) {
    const versionNumber = parseFloat(currentVersion.replaceAll(".", ""));

    const filteredPrivacyPolicy = versionList.filter((eula) => eula.versionNumber >= versionNumber);

    if (filteredPrivacyPolicy.length > 1) return [filteredPrivacyPolicy[0], filteredPrivacyPolicy[filteredPrivacyPolicy.length - 1]];
    return [filteredPrivacyPolicy[0]];
  }

  // Select last eula
  return [versionList[versionList.length - 1]];
}