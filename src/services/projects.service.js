// eslint-disable-next-line import/no-extraneous-dependencies
const faker = require('faker');
const { Projects } = require('../models');

const generateRandomProjects = (numProjects) => {
  const projects = [];
  const currentAmount = faker.datatype.number({ min: 500 });
  const targetAmount = faker.datatype.number({ min: currentAmount + 1 });
  for (let i = 0; i < numProjects; i += 1) {
    const project = new Projects({
      proposer: faker.name.findName(),
      projectVisual: faker.image.imageUrl(),
      projectName: `Balance衡壓坐墊｜市場唯一衡壓概念健康坐墊，坐出 Q 軟好體態！${i}`,
      startTime: faker.date.past(),
      endTime: faker.date.future(),
      projectType: faker.datatype.number({ min: 1, max: 4 }),
      projectStatus: faker.datatype.number({ min: 1, max: 7 }),
      projectForm: faker.datatype.number({ min: 1, max: 2 }),
      category: faker.datatype.number({ min: 1, max: 6 }),
      backers: faker.datatype.number(),
      currentAmount,
      targetAmount,
      projectUrl: faker.internet.url(),
      projectContent: `<div>${faker.lorem.paragraph()}</div>`,
      score: faker.datatype.number({ min: 1, max: 5 }),
      carousel: faker.datatype.boolean(),
      description: faker.lorem.paragraph(),
    });
    projects.push(project);
  }
  return projects;
};

const getProjects = async (query) => {
  // page 預設get頁數
  // perPage 預設取得資料筆數
  const { projectType, category, sortBy, page = 1, perPage = 20 } = query;
  const pipeline = [];
  // filter
  if (category) {
    pipeline.push({ $match: { category } });
  }
  if (projectType) {
    pipeline.push({ $match: { projectType } });
  }
  // sort
  if (sortBy === 'endTime') {
    // 專案結束 排序舊 -> 新
    pipeline.push({ $sort: { endTime: 1 } });
  } else {
    // 專案開始 排序新 -> 舊
    pipeline.push({ $sort: { startTime: -1 } });
  }
  // pagination
  const skipCount = (page - 1) * perPage;
  pipeline.push({ $skip: skipCount });
  pipeline.push({ $limit: perPage });

  const data = await Projects.aggregate(pipeline).exec();
  const total = await Projects.countDocuments();

  return {
    data,
    total,
  };
};

const postFakeProjects = async (query) => {
  try {
    // 生成count筆亂數 projects 資料
    const { count } = query;
    const randomProjects = generateRandomProjects(count || 1);
    const result = await Projects.create(randomProjects);
    return result;
  } catch (error) {
    throw new Error('postFakeProjects api error: ', error);
  }
};

module.exports = {
  getProjects,
  postFakeProjects,
};
