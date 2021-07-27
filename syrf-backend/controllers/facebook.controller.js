const { default: axios } = require('axios');
const { handleErrorResponse } = require('../utils/helpers');

module.exports = {

    /**
     * Exchange Facebook short lived token for long lived token
     * @param token facebook short lived token
     */
    async exchangeToken(req, res, next) {
        var facebookResponse;
        const exchangeParams = {
            grant_type: 'fb_exchange_token',
            client_id: process.env.FACEBOOK_CLIENT_ID,
            client_secret: process.env.FACEBOOK_CLIENT_SECRET,
            fb_exchange_token: req.body.token,
        };

        try {
            facebookResponse = await axios.get('https://graph.facebook.com/oauth/access_token', {
                params: exchangeParams
            });
        } catch (err) {
            return handleErrorResponse(err, res);
        }

        return res.json(facebookResponse.data);
    }
}