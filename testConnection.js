// const db = require("./models/index.js");

// (async () => {
//   try {
//     await db.sequelize.authenticate();
//     console.log("Got connected to database.");
//   } catch (error) {
//     console.log("Error in connecting to database: ", error);
//   } finally {
//     await db.sequelize.close();
//   }
// })();

const db = require("./models/index.js");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgresql://postgres.iopahemaktrolpccznvr:rY83PLtdBDN8R0nR@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");
  } catch (error) {
    console.log("Connection error:", error);
  }
})();
