const axios = require('axios');
const uuid = require('uuid');

/**
 * Class Request
 * For interacting with SYRF relative APIs
 */
class Request {
    isRefreshing;
    failedRequests;
    client;

    constructor() {
        this.isRefreshing = false;
        this.failedRequests = [];
        this.client = axios.create();
        this.beforeRequest = this.beforeRequest.bind(this);
        this.onRequestFailure = this.onRequestFailure.bind(this);
        this.processQueue = this.processQueue.bind(this);
        this.client.interceptors.request.use(this.beforeRequest);
        this.client.interceptors.response.use(this.onRequestSuccess, this.onRequestFailure);
    }

    async beforeRequest(request) {
        var token = await anonymousLogin();
        if (token)
            request.headers['Authorization'] = "Bearer " + token;
        return request;
    }

    async onRequestSuccess(response) {
        return response;
    }

    async onRequestFailure(err) {
        throw err;
    }

    processQueue(error, token = null) {
        this.failedRequests.forEach((prom) => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        this.failedRequests = [];
    }

}

function anonymousLogin() {
    return axios.post(`${process.env.SYRF_API_URL}${process.env.SYRF_API_VERSION}/auth/anonymous-login`, {
        id: uuid.v4(),
        devToken: process.env.SYRF_API_DEV_TOKEN
    }).then(response => {
        return response.data?.token
    }).catch(error => {
        return '';
    })
}

const request = new Request();

module.exports = request.client;
