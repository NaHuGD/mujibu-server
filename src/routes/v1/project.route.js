const express = require('express');
// const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const projectValidation = require('../../validations/project.validation');
const projectController = require('../../controllers/project.controller');

const router = express.Router();

router.route('/').get(validate(projectValidation.getProjects), projectController.getProjects);
router.route('/:projectId').get(validate(projectValidation.getProjectById), projectController.getProjectById);
router.route('/fake').post(projectController.postFakeProjects);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Projects
 */
