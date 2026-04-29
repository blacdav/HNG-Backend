import { dbConfig } from "./index.js";

export default {
    development: {...dbConfig,
        username: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.name,
        host: dbConfig.host,
        dialect: dbConfig.dialect,
    }
}