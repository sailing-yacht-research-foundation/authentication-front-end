const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
  res.redirect('https://syrf.io');
});

/**
 * Exchange Facebook short lived token for long lived token
 * @param token facebook short lived token
 */
router.post('/facebook/token/exchange', async function (req, res, next) {
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
});

/**
 * Exchange Instagram short lived token for long lived token
 */
router.post('/instagram/token/exchange', async function (req, res, next) {
  var instagramResponse;
  const exchangeParams = {
    grant_type: 'ig_exchange_token',
    client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
    access_token: req.body.token,
  };

  try {
    instagramResponse = await axios.get('https://graph.instagram.com/access_token', {
      params: exchangeParams
    });
  } catch (err) {
    return handleErrorResponse(err, res);
  }

  return res.json(instagramResponse.data);
});

/**
 * Refresh Instagram long lived token
 * @param token old long lived token
 */
router.post('/instagram/token/refresh', async function (req, res, next) {
  var instagramResponse;
  const params = {
    grant_type: 'ig_refresh_token',
    access_token: req.body.token,
  };

  try {
    instagramResponse = await axios.get('https://graph.instagram.com/refresh_access_token', {
      params: params
    });
  } catch (err) {
    return handleErrorResponse(err, res);
  }

  return res.json(instagramResponse.data);
});

/**
 * Get Instagram short lived token
 * @param code Instagram code
 */
router.post('/instagram/token', async function (req, res, next) {
  var instagramResponse;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', process.env.INSTAGRAM_CLIENT_ID);
  params.append('client_secret', process.env.INSTAGRAM_CLIENT_SECRET);
  params.append('code', req.body.code);
  params.append('redirect_uri', process.env.INSTAGRAM_REDIRECT_URL);

  try {
    instagramResponse = await axios.post('https://api.instagram.com/oauth/access_token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  } catch (err) {
    return handleErrorResponse(err, res);
  }

  return res.json(instagramResponse.data);
});

/**
 * Handle error response
 * @param {*} err error object from axios
 * @param {*} res response
 * @returns 
 */
function handleErrorResponse(err, res) {
  if (err.response)
    return res.json(400, err.response.data);
  return res.status(500);
}

module.exports = router;
