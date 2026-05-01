import { sequelize } from "./index.js";

export const dbConn = async () => {
  try {
    await sequelize.authenticate();
    // await sequelize.sync({ alter: true });
    console.log("Database connected successfully");
    return true;
  } catch (err) {
    console.error("Database connection failed:", err);
    return false;
    // process.exit(1);
  }
};