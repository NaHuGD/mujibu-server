const Joi = require('joi');

const collectBody = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    projectId: Joi.string().required(),
  }),
};

const getUserCollect = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

module.exports = {
  collectBody,
  getUserCollect,
};
