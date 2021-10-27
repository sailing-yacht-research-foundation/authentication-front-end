import { SYRF_SERVER } from 'services/service-constants';
import syrfRequest from 'utils/syrf-request';

export const getAll = () => {
    const userId: any = localStorage.getItem('user_id');
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events${!!userId ? `?createdById_eq=${userId}` : ''}`)
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

export const getMany = (page) => {
    const userId: any = localStorage.getItem('user_id');
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events${!!userId ? `?createdById_eq=${userId}` : ''}`, {
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

export const get = (id) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${id}`)
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

export const create = (data) => {
    return syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events`, {
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

export const update = (id, data) => {
    return syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${id}`, {
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

export const deleteRace = (id) => {
    return syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${id}`).then(response => {
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

export const downloadIcalendarFile = (event) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${event.id}/ics`, { responseType: 'blob' }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${event.name}.ics`); //or any other extension
        document.body.appendChild(link);
        link.click();
    }).catch(error => {
        return {
            success: false,
            error: error
        }
    })
}