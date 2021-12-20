import { UserDeleteOutlined } from '@ant-design/icons';
import { SYRF_SERVER } from 'services/service-constants';
import syrfRequest from 'utils/syrf-request';

export const getProfileById = (profileId) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/profile/${profileId}`)
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

export const getTopRecommandation = ({ locale, page, size }) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/recommendations/top?locale=${locale}`, {
        params: {
            page: page,
            size: size || 10
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

export const getHotRecommandation = ({ locale, page, size }) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/recommendations/hot?locale=${locale}`, {
        params: {
            page: page,
            size: size || 10
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

export const followProfile = (profileId) => {
    return syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follow/${profileId}`)
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

export const unfollowProfile = (profileId) => {
    return syrfRequest.delete(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/unfollow/${profileId}`)
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

export const getFollowers = (profileId, page) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follower/${profileId}`, {
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

export const getFollowings = (profileId, page) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/following/${profileId}`, {
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

export const searchForProfiles = (keyword, locale) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/search?name=${keyword}&locale=${locale}`)
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

export const getRequestedFollowRequests = (page) => {
    return syrfRequest.get(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follower/?status=REQUESTED`, {
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

export const acceptFollowRequest = (requestId) => {
    return syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follow-request/${requestId}`, {
        acceptRequest: true
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

export const rejectFollowRequest = (requestId) => {
    return syrfRequest.patch(`${SYRF_SERVER.API_URL}${SYRF_SERVER.API_VERSION}/social/follow-request/${requestId}`, {
        acceptRequest: false
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