import { EulaInterface } from "types/Eula";

export const eulaVersionsFilter = (currentVersion: string, versionList: EulaInterface[]): EulaInterface[] => {
  // Select aggreed version and last eula
  if (currentVersion) {
    const versionNumber = parseFloat(currentVersion.replaceAll(".", ""));

    const filteredEula = versionList.filter((eula) => eula.versionNumber >= versionNumber);

    if (filteredEula.length > 1) return [filteredEula[0], filteredEula[filteredEula.length - 1]];
    return [filteredEula[0]];
  }

  // Select last eula
  return [versionList[versionList.length - 1]];
}