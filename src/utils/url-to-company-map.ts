import { CompanyTypes } from "types/Company";
import { CompanyUrlTypes } from "types/CompanyUrl";

export const urlToCompany = (url: string) => {
  const companyUrlsToCheck = [CompanyUrlTypes.ISAIL, CompanyUrlTypes.KATTACK, CompanyUrlTypes.METASAIL];
  const companyList = {
    [CompanyUrlTypes.ISAIL]: CompanyTypes.ISAIL,
    [CompanyUrlTypes.KATTACK]: CompanyTypes.KATTACK,
    [CompanyUrlTypes.METASAIL]: CompanyTypes.METASAIL,
  };

  const result: string[] = [];
  companyUrlsToCheck.forEach((companyUrl) => {
    if (url.includes(companyUrl)) result.push(companyList[companyUrl]);
  });

  return result[0] || "THIS RACE";
};
