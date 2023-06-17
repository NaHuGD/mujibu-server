const catchAsync = require('../utils/catchAsync');
const { collectService } = require('../services');

const postCollect = catchAsync(async (req, res) => {
  const { body } = req;
  const result = await collectService.postCollect(body);
  res.send(result);
});

const deleteCollect = catchAsync(async (req, res) => {
  const { body } = req;
  const result = await collectService.deleteCollect(body);
  res.send(result);
});

const getUserCollect = catchAsync(async (req, res) => {
  const { params } = req;
  const result = await collectService.getUserCollect(params);
  res.send(result);
});

module.exports = {
  postCollect,
  deleteCollect,
  getUserCollect,
};
