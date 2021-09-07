import { SYRF_SERVER } from 'services/service-constants';
import syrfRequest from 'utils/syrf-request';

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
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${calendarEventId}/competition-units`, {
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
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units`, {
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
    })
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