import { SYRF_SERVER } from 'services/service-constants';
import syrfService from 'utils/syrf-request';

export const list = () => {
    return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses`).then(response => {
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

export const create = (eventId, name, courseSequencedGeometries) => {
    return syrfService.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses`, {
        courseSequencedGeometries: courseSequencedGeometries,
        calendarEventId: eventId,
        name: name
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

export const deleteCourse = (courseId) => {
    return syrfService.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}`).then(response => {
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

export const update = (eventId, courseId, name, courseSequencedGeometries) => {
    return syrfService.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/courses/${courseId}`, {
        courseSequencedGeometries: courseSequencedGeometries,
        name: name
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

export const updateCourseGeometry = (courseId, name, courseSequencedGeometries) => {
    return syrfService.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}/sequenced`, courseSequencedGeometries).then(response => {
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

export const getByCompetitionUnit = (competitionUnitId) => {
    return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/competition-units/${competitionUnitId}/course`).then(response => {
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

export const getById = (courseId) => {
    return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}`)
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
        });
}

export const getByEventId = (eventId, params) => {
    return syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/courses`, {
        params: params
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
        });
}