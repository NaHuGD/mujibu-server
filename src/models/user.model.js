const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      trim: true,
      ref: 'Team',
    },
    avatar: {
      type: String,
      trim: true,
      default: '',
    },
    name: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    nickname: {
      type: String,
      trim: true,
      default: '',
    },
    birthDate: {
      type: Date,
    },
    gender: {
      type: Number,
      enum: [0, 1, 2], // 'male', 'female', 'other'
      default: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (value && (!value.match(/\d/) || !value.match(/[a-zA-Z]/))) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subscribeNewsletter: {
      type: Boolean,
      default: false,
    },
    category: {
      type: [String],
      enum: ['藝術', '設計', '電影', '音樂', '科技', '出版'],
      default: [],
    },
    contactName: {
      type: String,
      trim: true,
      default: '',
    },
    commentName: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    countryCode: {
      type: String,
      trim: true,
      default: '',
    },
    postalCode: {
      type: String,
      trim: true,
      default: '',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    district: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    notifications: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Notification',
    },
    collects: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Project',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
