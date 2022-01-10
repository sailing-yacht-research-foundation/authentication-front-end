import syrfRequest from 'utils/syrf-request';
import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';

export const joinCompetitionUnit = (eventId, vesselId, lon, lat) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/open-competitions/${eventId}/join`, {
        lat: lat,
        lon: lon,
        vesselId,
        radius: 1000
    }));
}