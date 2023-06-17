const express = require('express');
const validate = require('../../middlewares/validate');
const collectValidation = require('../../validations/collect.validation');
const collectController = require('../../controllers/collect.controller');
// const { validateFirebaseGoogle } = require('../../middlewares/validateFirebaseGoogle');

const router = express.Router();
// TODO: login validate
router.route('/').post(validate(collectValidation.collectBody), collectController.postCollect);
router.route('/').delete(validate(collectValidation.collectBody), collectController.deleteCollect);
router.route('/:userId').get(validate(collectValidation.getUserCollect), collectController.getUserCollect);

module.exports = router;
