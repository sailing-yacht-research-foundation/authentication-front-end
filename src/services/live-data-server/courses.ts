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

export const create = (data) => {
    return syrfService.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses`, {
        competitionUnitId: data.competitionUnitId,
        courseSequencedGeometries: data.courseSequencedGeometries
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

export const update = (courseId, data) => {
    return syrfService.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/courses/${courseId}`, {
        competitionUnitId: data.competitionUnitId,
        courseSequencedGeometries: data.courseSequencedGeometries
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