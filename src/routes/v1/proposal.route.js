const express = require('express');
const auth = require('../../middlewares/auth');
// const validate = require('../../middlewares/validate');
const teamController = require('../../controllers/team.controller');
const projectController = require('../../controllers/project.controller');
const proposalController = require('../../controllers/proposal.controller');

const router = express.Router();

router
  .route('/')
  .get(proposalController.getProposal)
  .post(
    auth('manageUsers'),
    teamController.postTeam,
    projectController.postProject,
    teamController.updateTeamProjectId,
    proposalController.postProposal
  );

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Proposal
 *   description: Proposal
 */
