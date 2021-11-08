import { EulaInterface } from "types/Eula";

export const eulaVersionsFilter = (versionList: EulaInterface[]): EulaInterface[] => {
  const sortedVersions = versionList.map((eula) => {
    const versionNumber = eula.version.split(".").map((v) => parseInt(v));

    return {
      ...eula,
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

  console.log({ sortedVersions });


  // Select last eula
  return [sortedVersions[sortedVersions.length - 1]];
};
