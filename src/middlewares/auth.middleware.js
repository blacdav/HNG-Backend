import jwt from "jsonwebtoken";
import TokenService from "../auth/github/services/tokens.js";

export const CheckAuthUser = async (req, res, next) => {
    // const { id } = req.params; // this part is not needed as we are using the token to verify the user
    try {
        let token;
        if (req.headers["x-client-type"] === "web") {
            token = req.cookies.access_token;
        } else {
            token = req.headers.authorization?.split(" ")[1];
        }

        console.log("token: ", token);

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Authorization Token Required"
            })
        }

        const decoded = await TokenService.verifyAccessToken(token);
        if (!decoded || typeof decoded !== "object") {
            return res.status(401).json({
                success: false,
                message: "Unauthenticated User"
            });
        }
        req.user = decoded;

        return next();
    } catch (err) {
        console.log(`Server Error: ${JSON.stringify(err)}`);
        return res.status(500).json(`Server Error: ${err}`)
        // return next(err);
    }
}