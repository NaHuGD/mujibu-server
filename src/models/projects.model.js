const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
// const validator = require('validator');
// const { roles } = require('../config/roles');

const projectsSchema = mongoose.Schema(
  {
    // projectTeamId: {
    //   type: mongoose.SchemaTypes.ObjectId,
    // },
    proposer: {
      type: String,
    },
    projectVisual: {
      type: String,
      trim: true,
      required: true,
    },
    projectName: {
      type: String,
      trim: true,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    projectType: {
      type: Number,
    },
    projectStatus: {
      type: Number,
    },
    projectForm: {
      type: Number,
    },
    category: {
      type: Number,
    },
    backers: {
      type: Number,
    },
    currentAmount: {
      type: Number,
    },
    targetAmount: {
      type: Number,
    },
    currentAmountPercentage: {
      type: Number,
      default() {
        return Math.ceil((this.currentAmount / this.targetAmount) * 100);
      },
    },
    projectUrl: {
      type: String,
    },
    projectContent: {
      type: String,
    },
    score: {
      type: Number,
    },
    carousel: {
      type: Boolean,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
projectsSchema.plugin(toJSON);

/**
 * @typedef Projects
 */
const Projects = mongoose.model('Project', projectsSchema);

module.exports = Projects;
