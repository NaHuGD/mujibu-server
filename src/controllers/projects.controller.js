const catchAsync = require('../utils/catchAsync');
const { projectsService } = require('../services');

const getProjects = catchAsync(async (req, res) => {
  const { query } = req;
  const result = await projectsService.getProjects(query);
  res.send(result);
});

const postFakeProjects = catchAsync(async (req, res) => {
  const { query } = req;

  const projectsFake = await projectsService.postFakeProjects(query);
  res.send(projectsFake);
});

module.exports = { getProjects, postFakeProjects };
