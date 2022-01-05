import { SYRF_SERVER } from 'services/service-constants';
import { EventState } from 'utils/constants';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getAll = () => {
    const userId: any = localStorage.getItem('user_id');
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events${!!userId ? `?createdById_eq=${userId}` : ''}`))
}

export const getMany = (page) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/my-events?isPrivate_eq=false`, {
        params: {
            page: page
        }
    }))
}

export const get = (id) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${id}`))
}

export const create = (data) => {
    return formatServicePromiseResponse(syrfRequest.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events`, {
        ...data
    }))
}

export const update = (id, data) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${id}`, {
        ...data
    }));
}

export const deleteEvent = (id) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${id}`))
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

export const getEditors = (eventId) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/editors`))
}

export const addEditor = (eventId, editorId) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/add-editors`, {
        userIds: [
            editorId
        ]
    }))
}

export const removeEditor = (eventId, editorId) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/remove-editors`, {
        data: {
            userIds: [
                editorId
            ]
        }
    }));
}

export const scheduleCalendarEvent = (eventId) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/status`, {
        status: EventState.SCHEDULED
    }));
}

export const toggleOpenForRegistration = (eventId: string, allowRegistration: boolean) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/manage-registration`, {
        allowRegistration
    }));
}

export const closeCalendarEvent = (eventId: string) => {
    return formatServicePromiseResponse(syrfRequest.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/stop`))
}

export const cancelCalendarEvent = (eventId) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/calendar-events/${eventId}/status`, {
        status: EventState.CANCELED
    }));
}
