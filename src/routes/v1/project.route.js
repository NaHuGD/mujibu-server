const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const projectsValidation = require('../../validations/projects.validation');
const projectsController = require('../../controllers/projects.controller');

const router = express.Router();

router.route('/').get(validate(projectsValidation.getProjects), projectsController.getProjects);
router.route('/fake').post(projectsController.postFakeProjects);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Projects
 */
