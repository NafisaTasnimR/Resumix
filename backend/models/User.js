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

  subscriptionStartDate: {
    type: Date,
    default: null
  },

  subscriptionEndDate: {
    type: Date,
    default: null
  },

  isSubscriptionActive: {
    type: Boolean,
    default: false
  },

  paymentHistory: [{
    paymentIntentId: String,
    amount: Number,
    currency: String,
    paymentDate: Date,
    subscriptionDuration: Number 
  }],

  downloadCount: { type: Number, default: 0 },
  atsCheckCount: { type: Number, default: 0 },

  createdAt: {
    type: Date,
    default: Date.now
  },

  defaultResumeData: {
    personalInfo: {
      fullName: { type: String, default: '' },
      professionalEmail: { type: String, default: '' },
      dateOfBirth: { type: Date },
      phone: { type: String },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      district: { type: String, default: '' },
      country: { type: String, default: '' },
      zipCode: { type: String, default: '' }
    },
    education: {
      type: [
        {
          institution: {
            type: String
          },
          degree: {
            type: String
          },
          fieldOfStudy: {
            type: String
          },
          startDate: {
            type: Date
          },
          endDate: Date,
          graduationDate: Date,
          isCurrentInstitute: {
            type: Boolean,
            default: false
          },
          city: String,
          state: String
        }
      ],
      default: []
    },
    experience: {
      type: [
        {
          employerName: {
            type: String
          },
          jobTitle: {
            type: String
          },
          city: String,
          state: String,
          startDate: {
            type: Date
          },
          endDate: Date,
          isCurrentJob: {
            type: Boolean,
            default: false
          }
        }
      ],
      default: []
    },
    skills: {
      type: [
        {
          skillName: { type: String },
          proficiencyLevel: { type: String },
          yearsOfExperience: { type: Number },
          skillDescription: { type: String }
        }
      ],
      default: []
    },
    achievements: {
      type: [
        {
          title: { type: String },
          organization: { type: String },
          dateReceived: { type: Date },
          category: { type: String },
          description: { type: String },
          website: { type: String }
        }
      ],
      default: []
    },
    references: {
      type: [
        {
          firstName: { type: String },
          lastName: { type: String },
          jobTitle: { type: String },
          company: { type: String },
          referenceEmail: { type: String },
          phone: { type: String },
          relationship: { type: String },
          description: { type: String },
          permissionToContact: { type: Boolean, default: false },
          customRelationship: { type: String }
        }
      ],
      default: []
    },
    hobbies: {
      type: [
        {
          hobbyName: { type: String },
          experienceLevel: { type: String },
          yearsInvolved: { type: Number },
          category: { type: String },
          description: { type: String },
          achievementsRecognition: { type: String },
          permissionToContact: { type: Boolean, default: false }
        }
      ],
      default: []
    },
    additionalInfos: {
      type: [
        {
          sectionTitle: { type: String },
          content: { type: String }
        }
      ],
      default: []
    },
    projects: {
      type: [
        {
          title: { type: String },
          description: { type: String },
          url: { type: String }
        }
      ],
      default: []
    }
  }
});

// Method to check if user has active subscription
UserSchema.methods.hasActiveSubscription = function () {
  const now = new Date();
  return this.isSubscriptionActive && this.subscriptionEndDate && this.subscriptionEndDate > now;
};

// Method to activate subscription
UserSchema.methods.activateSubscription = function (durationInDays = 14) {
  const now = new Date();
  this.userType = 'paid';
  this.isSubscriptionActive = true;
  this.subscriptionStartDate = now;
  this.subscriptionEndDate = new Date(now.getTime() + (durationInDays * 24 * 60 * 60 * 1000));
};

// Method to deactivate subscription
UserSchema.methods.deactivateSubscription = function () {
  this.userType = 'free';
  this.isSubscriptionActive = false;
  this.subscriptionEndDate = null;
};

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;