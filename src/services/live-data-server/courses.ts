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

export const create = (competitionUnitId, courseSequencedGeometries) => {
    return syrfService.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses`, {
        courseSequencedGeometries: courseSequencedGeometries,
        competitionUnitId: competitionUnitId
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

export const update = (competitionUnitId, courseId, courseSequencedGeometries) => {
    return syrfService.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}`, {
        courseSequencedGeometries: courseSequencedGeometries,
        competitionUnitId: competitionUnitId
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

export const updateCourseGeometry = (courseId, courseSequencedGeometries) => {
    console.log(courseSequencedGeometries);
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