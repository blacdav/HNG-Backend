import { sequelize } from "./index.js";

export const dbConn = async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ alter: true });
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
    // process.exit(1);
  }
};