import { SYRF_SERVER } from 'services/service-constants';
import { formatServicePromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getProfileById = (profileId: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/profile/${profileId}`))
}

export const getTopRecommandation = ({ locale, page, size }: { locale: string, page: number, size: number }) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/recommendations/top?locale=${locale}`, {
        params: {
            page: page,
            size: size || 10
        }
    }))
}

export const getHotRecommandation = ({ locale, page, size }: { locale: string, page: number, size: number }) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/recommendations/hot?locale=${locale}`, {
        params: {
            page: page,
            size: size || 10
        }
    }))
}

export const followProfile = (profileId: string) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follow/${profileId}`))
}

export const unfollowProfile = (profileId: string) => {
    return formatServicePromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/unfollow/${profileId}`))
}

export const getFollowers = (profileId: string, page: number) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follower/${profileId}`, {
        params: {
            page: page
        }
    }))
}

export const getFollowings = (profileId: string, page: number) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/following/${profileId}`, {
        params: {
            page: page
        }
    }))
}

export const searchForProfiles = (keyword: string, locale: string) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/search?name=${keyword}&locale=${locale}`))
}

export const getRequestedFollowRequests = (page: number) => {
    return formatServicePromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follower/?status=REQUESTED`, {
        params: {
            page: page
        }
    }))
}

export const acceptFollowRequest = (requestId: string) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follow-request/${requestId}`, {
        acceptRequest: true
    }))
}

export const rejectFollowRequest = (requestId: string) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follow-request/${requestId}`, {
        acceptRequest: false
    }))
}

export const blockUser = (userId: string) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/block/${userId}`));
}

export const unblockUser = (userId: string) => {
    return formatServicePromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/unblock/${userId}`));
}