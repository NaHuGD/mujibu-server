const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Project } = require('../models');
const { User } = require('../models');

// 將user collect id轉為project資料
const transformUserCollectList = async (userId) => {
  try {
    const user = await User.findById(userId).populate('collects').exec();
    const userCollects = user.collects;
    const total = userCollects.length;

    return { userCollects, total };
  } catch (err) {
    throw new ApiError(httpStatus.NOT_FOUND, `Error: transformUserCollectList ${err}`);
  }
};

const getCollectProject = async (userId, projectId, isCollect) => {
  // 檢查使用者是否存在
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  // 檢查專案是否存在
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(httpStatus.NOT_FOUND, 'project not found');
  }
  // 新增收藏時檢查專案是否已被收藏
  const isProjectCollected = user && user.collects.includes(projectId);
  if (isCollect && isProjectCollected) {
    throw new ApiError(httpStatus.CONFLICT, 'project already collected');
  }
  // 刪除時檢查user是否有收藏
  if (!isCollect && !isProjectCollected) {
    throw new ApiError(httpStatus.NOT_FOUND, 'project not collected');
  }
  if (isCollect) {
    // 新增收藏
    user.collects.push(projectId);
  } else {
    // 刪除收藏
    user.collects = user.collects.filter((itemId) => !itemId.equals(projectId));
  }
  await user.save();
  const userCollects = transformUserCollectList(userId);
  return userCollects;
};

const postCollect = async (body) => {
  const { userId, projectId } = body;
  const { userCollects, total } = await getCollectProject(userId, projectId, true);
  return {
    status: 'Success',
    data: userCollects,
    total,
  };
};

const deleteCollect = async (body) => {
  const { userId, projectId } = body;
  const { userCollects, total } = await getCollectProject(userId, projectId, false);

  return {
    status: 'Success',
    data: userCollects,
    total,
  };
};

const getUserCollect = async (params) => {
  // TODO: page limit
  const { userId } = params;
  const { userCollects, total } = await transformUserCollectList(userId);

  return {
    status: 'Success',
    data: userCollects,
    total,
  };
};

module.exports = { postCollect, deleteCollect, getUserCollect };
