import { SYRF_SERVER } from 'services/service-constants';
import syrfService from 'utils/syrf-request';

export const list = (action) => {
    const listParams: any = {};
    const params = action.payload;

    listParams.q = action.payload.keyword;
    listParams.size = 10;

    if (params.hasOwnProperty('page')) {
        listParams.page = params.page;
    }

    if (params.hasOwnProperty('from_date') && params.from_date !== '') {
        listParams.approximateStartTime_gt = params.from_date;
    }

    if (params.hasOwnProperty('to_date') && params.to_date !== '') {
        listParams.approximateStartTime_lte = params.to_date;
    }

    return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events`, {
        params: listParams
    }).then(response => {
        return {
            success: true,
            data: response.data
        }
    }).catch(error => {
        return {
            success: false,
            error: error
        }
    });
}
