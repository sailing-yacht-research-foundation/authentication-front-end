import { UserDeleteOutlined } from '@ant-design/icons';
import { SYRF_SERVER } from 'services/service-constants';
import { formatRequestPromiseResponse } from 'utils/helpers';
import syrfRequest from 'utils/syrf-request';

export const getProfileById = (profileId) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/profile/${profileId}`))
}

export const getTopRecommandation = ({ locale, page, size }) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/recommendations/top?locale=${locale}`, {
        params: {
            page: page,
            size: size || 10
        }
    }))
}

export const getHotRecommandation = ({ locale, page, size }) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/recommendations/hot?locale=${locale}`, {
        params: {
            page: page,
            size: size || 10
        }
    }))
}

export const followProfile = (profileId) => {
    return formatRequestPromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follow/${profileId}`))
}

export const unfollowProfile = (profileId) => {
    return formatRequestPromiseResponse(syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/unfollow/${profileId}`))
}

export const getFollowers = (profileId, page) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follower/${profileId}`, {
        params: {
            page: page
        }
    }))
}

export const getFollowings = (profileId, page) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/following/${profileId}`, {
        params: {
            page: page
        }
    }))
}

export const searchForProfiles = (keyword, locale) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/search?name=${keyword}&locale=${locale}`))
}

export const getRequestedFollowRequests = (page) => {
    return formatRequestPromiseResponse(syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follower/?status=REQUESTED`, {
        params: {
            page: page
        }
    }))
}

export const acceptFollowRequest = (requestId) => {
    return formatRequestPromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follow-request/${requestId}`, {
        acceptRequest: true
    }))
}

export const rejectFollowRequest = (requestId) => {
    return formatRequestPromiseResponse(syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follow-request/${requestId}`, {
        acceptRequest: false
    }))
}