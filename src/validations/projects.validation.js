const Joi = require('joi');

const getProjects = {
  query: Joi.object().keys({
    projectType: Joi.number().default(0),
    category: Joi.number().default(0),
    sortBy: Joi.string().default('startTimer'),
    page: Joi.number(),
    perPage: Joi.number(),
  }),
};

module.exports = { getProjects };
