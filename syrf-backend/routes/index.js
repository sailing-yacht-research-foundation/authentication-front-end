const express = require('express');
const facebook = require('../controllers/facebook.controller');
const instagram = require('../controllers/instagram.controller');
const versioning = require('../controllers/versioning.controller');
const router = express.Router();
const { versioningCreateValidationRules } = require('../controllers/validators/versioning');
const { validate } = require('../utils/helpers');

router.get('/', async function (req, res, next) {
  res.redirect('https://syrf.io');
});

router.post('/facebook/token/exchange', facebook.exchangeToken);

router.post('/instagram/token/exchange', instagram.exchangeTokenForLongLivedToken);
router.post('/instagram/token/refresh', instagram.refreshLongLivedToken);
router.post('/instagram/token', instagram.getShortLivedTokenFromCode);

router.post('/versioning', versioningCreateValidationRules(), validate, versioning.create);

module.exports = router;
