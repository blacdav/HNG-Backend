import jwt from "jsonwebtoken";
import TokenService from "../auth/github/services/tokens.js";

export const CheckAuthUser = async (req, res, next) => {
    try {
        let token;
        if (req.headers["x-client-type"] === "web") {
            token = req.cookies.access_token;
        } else {
            token = req.headers.authorization?.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authorization Required"
            })
        }

        const decoded = await TokenService.verifyAccessToken(token);
        if (!decoded || typeof decoded !== "object") {
            return res.status(401).json({
                status: "failed",
                message: "Unauthenticated User"
            });
        }
        req.user = decoded;

        return next();
    } catch (err) {
        return res.status(401).json({
            status: "error",
            message: "Session Expired"
        })
    }
}