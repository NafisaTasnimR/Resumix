const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
  username: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true
  },

  userType: {
    type: String,
    enum: ['free', 'paid'],
    default: 'free'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  defaultResumeData: {
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      summary: { type: String, default: '' }
    },
    education: {
      type: [
        {
          institution: String,
          degree: String,
          startYear: Number,
          endYear: Number
        }
      ],
      default: []
    },
    experience: {
      type: [
        {
          position: String,
          company: String,
          startDate: String,
          endDate: String,
          description: String
        }
      ],
      default: []
    },
    skills: {
      type: [String],
      default: []
    },
    projects: {
      type: [
        {
          title: String,
          description: String,
          url: String
        }
      ],
      default: []
    },
    languages: {
      type: [String],
      default: []
    }
  }

});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;