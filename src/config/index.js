// this part is for serverless deployment, e.g vercel
if (process.env.NODE_ENV !== "production") {
  const { configDotenv } = await import("dotenv");
  configDotenv();
}

export const dbConfig = {
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  ssl: process.env.DB_CA_CERT,
  dialect: "mysql"
}

export const ghConfig = {
  clientId: process.env.GH_CLIENT_ID,
  clientSecret: process.env.GH_CLIENT_SECRET,
  callbackUrl: process.env.GH_CALLBACK_URL
}