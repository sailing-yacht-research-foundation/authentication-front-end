import syrfRequest from 'utils/syrf-request';
import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';

export const joinCompetitionUnit = (raceId: string, vesselId: string,  sailNumber: string, allowShareInformation: boolean, lon: number, lat: number) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/open-competitions/${raceId}/join`, {
        lat: lat,
        lon: lon,
        vesselId,
        sailNumber,
        radius: 1000,
        allowShareInformation
    }));
}