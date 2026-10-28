const app = require('../server/src/server');
const { initializeDatabase } = require('../server/src/config/db');

let isDbInitialized = false;

module.exports = async (req, res) => {
  if (!isDbInitialized) {
    try {
      await initializeDatabase();
      isDbInitialized = true;
    } catch (err) {
      console.error('Serverless DB init error:', err);
    }
  }
  return app(req, res);
};
