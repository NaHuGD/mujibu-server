const httpStatus = require('http-status');
const { fakerZH_TW: faker } = require('@faker-js/faker');
const ApiError = require('../utils/ApiError');
const { Project } = require('../models');

const generateRandomProjects = (numProjects) => {
  const fakeData = [];
  for (let i = 0; i < numProjects; i += 1) {
    const project = {};
    const currentAmount = faker.number.int({ min: 0, max: 10000000 / 2 });
    const goalAmount = faker.number.int({ min: currentAmount, max: 10000000 });
    project.projectProposer = {
      id: faker.database.mongodbObjectId(),
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    };
    project.projectTeam = {
      _id: faker.database.mongodbObjectId(),
      teamName: `團隊名稱_${i}`,
      teamIntroduction: faker.lorem.paragraph(),
      teamAvatar: faker.image.avatar(),
      representativeName: `${faker.person.firstName()} ${faker.person.lastName()}`,
      representativeMobile: faker.phone.imei(),
      representativePhone: faker.phone.imei(),
      representativeEmail: faker.internet.email(),
      companyName: `公司名稱_${i}`,
      companyPhone: faker.phone.imei(),
      companyRegistrationNumber: faker.string.alpha(10),
      companyAddress: '公司地址-公司地址-公司地址',
      socialWebsite: faker.internet.url(),
      socialEmail: faker.internet.email(),
      socialFb: faker.internet.url(),
      socialLine: faker.internet.url(),
      socialIg: faker.internet.url(),
      socialYoutube: faker.internet.url(),
    };
    project.projectPlans = [];
    for (let j = 0; j < 3; j += 1) {
      const plan = {
        planName: faker.commerce.productName(),
        planType: faker.helpers.arrayElement(['Type A', 'Type B', 'Type C']),
        planQuantity: faker.number.int({ min: 0, max: 3 }),
        planDiscountPrice: faker.commerce.price(),
        planOriginalPrice: faker.commerce.price(),
        planStartTime: faker.date.future(),
        planEndTime: faker.date.future(),
        planImage: faker.image.url(),
        planDescription: faker.lorem.paragraph(),
        planNotes: [faker.lorem.sentence(), faker.lorem.sentence()],
        isRealProduct: faker.datatype.boolean(),
      };
      project.projectPlans.push(plan);
    }
    project.latestNews = [faker.lorem.sentence(), faker.lorem.sentence()];
    project.faqs = [faker.lorem.sentence(), faker.lorem.sentence()];
    project.comments = [faker.lorem.sentence(), faker.lorem.sentence()];
    project.projectOrders = [faker.database.mongodbObjectId()];
    project.projectRefunds = [faker.database.mongodbObjectId()];
    project.projectFollowers = [faker.database.mongodbObjectId()];
    project.projectType = faker.number.int({ min: 0, max: 1 });
    project.projectForm = faker.number.int({ min: 0, max: 3 });
    project.projectStatus = faker.number.int({ min: 0, max: 9 });
    project.projectCategory = faker.number.int({ min: 0, max: 5 });
    project.projectName = faker.commerce.productName();
    project.projectImage = faker.image.url();
    project.projectDescription = faker.lorem.paragraph();
    project.goalAmount = goalAmount;
    project.currentAmount = currentAmount;
    project.startTime = faker.date.past();
    project.endTime = faker.date.future();
    project.officialPage = faker.internet.url();
    project.fanPage = faker.internet.url();
    project.attachmentLink = faker.internet.url();
    project.projectContent = faker.lorem.paragraph();
    project.projectScore = faker.number.int({ min: 0, max: 10 });
    project.projectBackers = faker.number.int({ min: 0, max: 10000 });
    project.projectUrl = faker.internet.url();
    project.carousel = faker.datatype.boolean();
    project.shippingSettings = {
      shippingSwitch: faker.datatype.boolean(),
      deliveryInfo: {
        deliverySwitch: faker.datatype.boolean(),
        deliveryFee: faker.number.int({ min: 0, max: 100 }),
        multiProductCheckout: faker.number.int({ min: 0, max: 1 }),
        freeShippingConditions: faker.number.int({ min: 0, max: 1 }),
        freeShippingPrice: faker.number.int({ min: 0, max: 3000 }),
        senderName: `${faker.person.firstName()} ${faker.person.lastName()}`,
        senderPhone: faker.phone.imei(),
        senderAddress: 'senderAddress',
        senderPostalCode: 'senderPostalCode',
      },
      cvsInfo: {
        cvsSwitch: faker.datatype.boolean(),
        deliveryFee: faker.number.int({ min: 0, max: 100 }),
        multiProductCheckout: faker.number.int({ min: 0, max: 1 }),
        freeShippingConditions: faker.number.int({ min: 0, max: 1 }),
        freeShippingPrice: faker.number.int({ min: 0, max: 3000 }),
        cvsName: faker.number.int({ min: 0, max: 2 }),
      },
    };

    fakeData.push(project);
  }
  return fakeData;
};

const getProjects = async (query) => {
  // page 預設get頁數
  // perPage 預設取得資料筆數
  const { projectForm, projectCategory, sortBy, page = 1, perPage = 20 } = query;
  let totalQuery = {};
  const pipeline = [];
  // filter
  if (projectCategory >= 0) {
    pipeline.push({ $match: { projectCategory } });
    totalQuery = {
      ...totalQuery,
      projectCategory,
    };
  }
  if (projectForm >= 0) {
    pipeline.push({ $match: { projectForm } });
    totalQuery = {
      ...totalQuery,
      projectForm,
    };
  }
  // sort
  if (sortBy === 'endTime') {
    // 專案結束 排序舊 -> 新
    pipeline.push({ $sort: { endTime: 1 } });
  } else if (sortBy === 'goalAmount') {
    pipeline.push({ $sort: { goalAmount: -1 } });
  } else {
    // 專案開始 排序新 -> 舊
    pipeline.push({ $sort: { startTime: -1 } });
  }
  // pagination
  const skipCount = (page - 1) * perPage;
  pipeline.push({ $skip: skipCount });
  pipeline.push({ $limit: perPage });
  const data = await Project.aggregate(pipeline).exec();
  const populatedData = await Project.populate(data, { path: 'projectTeam' });
  const total = await Project.countDocuments(totalQuery);

  return {
    data: populatedData,
    total,
  };
};

const getProjectById = async (projectId) => {
  const data = await Project.findById(projectId);
  if (!data) {
    throw new ApiError(httpStatus.NOT_FOUND, 'projectId not found');
  }
  return {
    status: 'Success',
    data,
  };
};

const postFakeProjects = async (query) => {
  // /api/projects/fake?count=60
  // 生成count筆亂數 projects 資料
  const { count } = query;
  const randomProjects = generateRandomProjects(count || 60);
  const result = await Project.create(randomProjects);
  return result;
};

const queryProjectsHot = async (filter, options) => {
  const projects = await Project.paginate(filter, options); // 使用 paginate 方法
  return projects;
};
const queryProjectsCarousel = async (filter, options) => {
  const projects = await Project.paginate(filter, options); // 使用 paginate 方法
  return projects;
};
const queryProjectsPicks = async (filter, options) => {
  const projectsHot = await Project.paginate(filter, options); // 使用 paginate 方法
  return projectsHot;
};
const queryProjectsSuccess = async (filter, options) => {
  const projects = await Project.paginate(filter, options); // 使用 paginate 方法
  return projects;
};
const queryProjectsNew = async (filter, options) => {
  const projects = await Project.paginate(filter, options); // 使用 paginate 方法
  return projects;
};

const createProject = async (userBody) => {
  const {
    projectProposer,
    projectType,
    projectName,
    projectDescription,
    projectImage,
    projectCategory,
    goalAmount,
    startTime,
    endTime,
    officialPage,
    fanPage,
    attachmentLink,
    projectContent,
    projectPlans,
    withdrawalSettings,
    shippingSettings,
  } = userBody.body;
  const { projectTeam } = userBody.team;
  const projects = {
    projectProposer,
    projectType,
    projectName,
    projectDescription,
    projectTeam,
    projectImage,
    projectCategory,
    goalAmount,
    startTime,
    endTime,
    officialPage,
    fanPage,
    attachmentLink,
    projectContent,
    projectPlans,
    withdrawalSettings,
    shippingSettings,
  };
  if (await Project.isProjectNameTaken(projectName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Project Name already taken');
  }
  return Project.create(projects);
};

module.exports = {
  getProjects,
  getProjectById,
  postFakeProjects,
  queryProjectsHot,
  queryProjectsCarousel,
  queryProjectsPicks,
  queryProjectsSuccess,
  queryProjectsNew,
  createProject,
};
