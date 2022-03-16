import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfService from 'utils/syrf-request';

export const getPlans = () => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/subscription/plans`));
}

export const getCustomerPortalLink = () => {
    return formatServicePromiseResponse(syrfService.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/subscription/customer-portal`));
}

export const previewSwitchPlan = (pricingId: string, quantity: number) => {
    return formatServicePromiseResponse(syrfService.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/subscription/preview-plan`, {
        pricingId,
        quantity
    }));
}

export const checkout = (pricingId: string, quantity: number) => {
    return formatServicePromiseResponse(syrfService.post(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/subscription/checkout`, {
        pricingId,
        quantity
    }));
}

export const switchPlan = (pricingId: string, quantity: number, prorationDate: number) => { // prorationDate is in UNIX timestamp format 
    return formatServicePromiseResponse(syrfService.put(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/subscription/switch-plan`, {
        pricingId,
        quantity,
        prorationDate
    }));
}

export const cancelPlan = (pricingId: string, quantity: number) => {
    return formatServicePromiseResponse(syrfService.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/subscription/cancel-plan`, {
        data: {
            pricingId,
            quantity
        }
    }));
}