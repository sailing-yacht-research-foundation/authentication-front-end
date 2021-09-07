import moment from 'moment';
import { SYRF_SERVER } from 'services/service-constants';
import syrfRequest from 'utils/syrf-request';

export const search = (action) => {
    const query: any = {
        bool: {
            must: []
        }
    };
    const params = action.payload;

    query.bool.must.push({
        match_phrase: {
            name: params.keyword
        }
    });

    if (params.hasOwnProperty('from_date')
        && params.from_date !== ''
        && moment(params.from_date).isValid()) {
        query.bool.must.push({
            range: {
                "approx_start_time_ms": {
                    "gte": moment(params.from_date).unix() * 1000,
                }
            }
        });
    }

    if (params.hasOwnProperty('to_date')
        && params.to_date !== ''
        && moment(params.to_date).isValid()) {
        query.bool.must.push({
            range: {
                "approx_start_time_ms": {
                    "lt": moment(params.to_date).unix() * 1000,
                }
            }
        });
    }

    return syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/search`, {
        track_total_hits: true,
        query: query,
        from: params.hasOwnProperty('page') ? ((Number(params.page) - 1) * Number(params?.size)) : 1,
        size: params.size ?? 10,
    }).then(response => {
        console.log(response);
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