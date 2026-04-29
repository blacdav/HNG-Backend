import mysql from "mysql2"; // ensurees that the mysql2 engine that sequelize uses is loaded
import { Sequelize } from "sequelize";
import { dbConfig } from "../config/index.js";

const sslCa = Buffer.from(dbConfig.ssl, "base64").toString("utf-8");

export const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    ssl: {
        ca: dbConfig.ssl
    },
    logging: console.log,
    // logging: (...msg) => console.log(msg),
    pool: {
        max: 10,
        min: 1,
        acquire: 30000,
        idle: 10000
    }
});