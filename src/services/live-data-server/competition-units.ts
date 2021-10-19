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
        params.from_date = params.from_date + ' 00:00:00';
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
        params.to_date = params.to_date + ' 23:59:59';
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

    searchParams._source = ["id", "name", "approx_start_point", "start_country", "start_city", "approx_start_time_ms", "event_name", "event_description"]; // only the fields we need
    searchParams.from = params.hasOwnProperty('page') ? ((Number(params.page) - 1) * Number(params?.size)) : 0;
    searchParams.size = params.size ?? 10;

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

export const create = (calendarEventId, data) => {
    return syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units`, {
        ...data
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
    })
}

export const getAllByCalendarEventId = (calendarEventId, page) => {
    const userId: any = localStorage.getItem('user_id');
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units${!!userId ? `?createdById_eq=${userId}` : ''}`, {
        params: {
            page: page
        }
    })
        .then(response => {
            return {
                success: true,
                data: response.data
            }
        }).catch(error => {
            return {
                success: false,
                error: error
            }
        })
}

export const getAllCompetitionUnits = (page) => {
    const userId: any = localStorage.getItem('user_id');
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units${!!userId ? `?createdById_eq=${userId}` : ''}`, {
        params: {
            page: page
        }
    })
        .then(response => {
            return {
                success: true,
                data: response.data
            }
        }).catch(error => {
            return {
                success: false,
                error: error
            }
        })
}

export const get = (calendarEventId, competitionUnitId) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units/${competitionUnitId}`)
        .then(response => {
            return {
                success: true,
                data: response.data
            }
        }).catch(error => {
            return {
                success: false,
                error: error
            }
        })
}

export const update = (calendarEventId, competitionUnitId, data) => {
    return syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units/${competitionUnitId}`, {
        ...data
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

export const deleteCompetitionUnit = (calendarEventId, competitionUnitId) => {
    return syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units/${competitionUnitId}`)
        .then(response => {
            return {
                success: true,
                data: response.data
            }
        }).catch(error => {
            return {
                success: false,
                error: error
            }
        })
}

export const getCompetitionUnitList = () => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units`, {
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

export const getCompetitionUnitById = (id) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${id}`, {
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
};

export const searchScrapedRaceById = (id: string) => {
    const searchParams: any = {
        query: {
            match: {
                '_id': id
            }
        },
    };

    searchParams._source = ["id", "name", "approx_start_point", "start_country", "approx_start_time_ms", "url", "source"];

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

export const cloneCourse = (fromCompetitionUnitId, toCompetitionUnitId, newName) => {
    return syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${toCompetitionUnitId}/clone-course`, {
        cloneFromCompetitionId: fromCompetitionUnitId,
        newName: newName
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

export const getAllCompetitionUnitsByEventIdWithSort = (calendarEventId, page) => {
    const userId: any = localStorage.getItem('user_id');
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units?sort=createdAt&srdir=-1${!!userId ? `&createdById_eq=${userId}` : ''}`, {
        params: {
            page: page
        }
    })
        .then(response => {
            return {
                success: true,
                data: response.data
            }
        }).catch(error => {
            return {
                success: false,
                error: error
            }
        })
}

export const getSimplifiedTracksByCompetitionUnit = (id: string) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${id}/simplified-tracks`).then(response => {
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

export const getLegsByCompetitionUnit = (id: string) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${id}/legs`).then(response => {
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

export const getTimeByCompetitionUnit = (id: string) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${id}/time`).then(response => {
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

export const getCourseByCompetitionUnit = (id: string) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${id}/course`).then(response => {
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
