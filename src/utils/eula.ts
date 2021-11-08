import { EulaInterface } from "types/Eula";

export const eulaVersionsFilter = (versionList: EulaInterface[]): EulaInterface[] => {
  const sortedVersions = versionList.map((eula) => ({
    ...eula,
    versionNumber: parseFloat(eula.version.replaceAll(".", "")) / 100,
  }));

  sortedVersions.sort((a, b) => a.versionNumber - b.versionNumber);

  // Select last eula
  return [sortedVersions[sortedVersions.length - 1]];
};
