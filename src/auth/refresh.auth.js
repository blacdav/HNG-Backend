import models from "../models/index.model.js";
import TokenService from "./github/services/tokens.js";

const { User } = models;

export const RefreshAuth = async (req, res) => {
    // receives a json body with refresh token,
    // creates and return new access and refresh tokens
    const { refresh_token } = req.query;

    try {
        const payload = await TokenService.verifyRefreshToken(refresh_token);

        const { github_id } = payload;

        const user = await User.findOne({ where: { github_id }, attributes: ["github_id", "role"] });

        const access_token = await TokenService.genAccessToken({ github_id, role: user.role });

        const new_refresh_token = await TokenService.genRefreshToken({ github_id });

        if (req.headers["x-client-type"] === "web") {
            res.cookie("access_token", access_token, { httpOnly: true, secure: true, sameSite: "strict" });

            res.cookie("refresh_token", new_refresh_token, { httpOnly: true, secure: true, sameSite: "strict" });

            return res.status(200).json({
                status: "success",
                message: "Tokens refreshed successfully"
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Tokens refreshed successfully",
                access_token,
                refresh_token: new_refresh_token
            });
        }
    } catch (err) {
        return res.status(400).json({
            status: "error",
            message: "Invalid refresh token"
        });
    }
}