import moment from 'moment';
import { SYRF_SERVER } from 'services/service-constants';
import syrfRequest from 'utils/syrf-request';

export const search = (params) => {
    const query: any = {
        bool: {
            must: []
        }
    };

    query.bool.must.push({
        query_string: {
            query: params.keyword
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

    const searchParams: any = {
        query: query,
    };

    searchParams._source = ["id","name","approx_start_point", "start_country", "approx_start_time_ms"]; // only the fields we need
    if (!params.get_all) {
        searchParams.from = params.hasOwnProperty('page') ? ((Number(params.page) - 1) * Number(params?.size)) : 1;
        searchParams.size = params.size ?? 10;
    } else {
        // 150 is for total results show on map, 
        // i think it's fine for now because if we increase the number higher it will take very long time to perform the request
        // also if we don't limit the results and when they're more than 1000 probaly the browser will be crashed.
        searchParams.size = 150; 
        searchParams.from = 0;
    }

    return syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/search`, searchParams).then(response => {
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