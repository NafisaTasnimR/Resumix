require('dotenv').config();

module.exports = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  testUser: {
    email: process.env.TEST_USER_EMAIL || '',
    password: process.env.TEST_USER_PASSWORD || '',
  },
};
