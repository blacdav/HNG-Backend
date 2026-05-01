import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import router from "./routes/routes.js";
import { dbConn } from "./db/config.js";

const app = express();
const logger = morgan("dev");

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "https://hng-frontend-opal.vercel.app"],
    methods: ["POST", "GET", "DELETE"],
    allowedHeaders: ["Content-Type", "Cookie", "x-client-type", "Authorization"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

dbConn();

app.use(async (req, res, next) => {
    // const ip = req.ip;

    try {
        // console.log(ip)
        return next();
    } catch (err) {
        return next(err);
    }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Backend is running",
  });
});

app.use('/api', router);

app.use((err, req, res, next) => {
    console.error(err);

    return res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    })
})

// removing app.listen because of vercel
if (process.env.NODE_ENV !== "production") {
    app.listen(8000, () => {
        console.log("Server is running on port 8000");
    });
}

export default app;