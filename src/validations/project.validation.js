const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProject = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getProjects = {
  query: Joi.object().keys({
    projectForm: Joi.number().default(-1),
    projectCategory: Joi.number().default(-1),
    sortBy: Joi.string().default('startTimer'),
    page: Joi.number(),
    perPage: Joi.number(),
  }),
};

const getProjectById = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

const updateProject = {
  params: Joi.object().keys({
    projectId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      // teamId: Joi.array().items(Joi.string().custom(objectId)).optional(),
      avatar: Joi.string().allow('').optional(),
      name: Joi.string().required(),
      nickname: Joi.string().required(),
      birthDate: Joi.date().required(),
      gender: Joi.number().valid(0, 1, 2).required(), // 'male', 'female', 'other'
      phone: Joi.string().required(),
      subscribeNewsletter: Joi.boolean().allow('').optional(),
      category: Joi.array()
        .items(Joi.string().valid(...['藝術', '設計', '電影', '音樂', '科技', '出版']))
        .allow('')
        .optional(),
      contactName: Joi.string().allow('').optional(),
      commentName: Joi.string().allow('').optional(),
      contactPhone: Joi.string().allow('').optional(),
      countryCode: Joi.string().allow('').optional(),
      postalCode: Joi.string().allow('').optional(),
      city: Joi.string().allow('').optional(),
      district: Joi.string().allow('').optional(),
      address: Joi.string().allow('').optional(),
      // role: Joi.string().valid('user', 'admin'), // 根據你的角色列表進行更改
      // notifications: Joi.array().items(Joi.string().custom(objectId)),
      // collects: Joi.array().items(Joi.string().custom(objectId)),
      // isEmailVerified: Joi.boolean(),
    })
    .min(1),
};

const deleteProject = {
  params: Joi.object().keys({
    projectId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
