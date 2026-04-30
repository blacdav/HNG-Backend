import models from "../models/index.model.js";
import TokenService from "./github/services/tokens.js";

const { User } = models;

export const RefreshAuth = async (req, res) => {
    const { refresh_token } = req.query;

    let refresh;

    if (req.headers["x-client-type"] === "web") {
        refresh = req.cookies.refresh_token;
    } else {
        refresh = refresh_token;
    }

    if (!token) {
        return res.status(401).json({
            status: "failed",
            message: "No token was received"
        })
    }

    try {
        const payload = await TokenService.verifyRefreshToken(refresh);

        const { github_id } = payload;

        const user = await User.findOne({ where: { github_id }, attributes: ["github_id", "role"] });

        const access_token = await TokenService.genAccessToken({ github_id, role: user.role });

        const new_refresh_token = await TokenService.genRefreshToken({ github_id });

        if (req.headers["x-client-type"] === "web") {
            res.cookie("access_token", access_token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 5 * 60 * 1000
            });

            res.cookie("refresh_token", new_refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                path: "/api/auth/refresh",
                maxAge: 5 * 60 * 1000
            });

            return res.status(200).json({
                status: "success",
                message: "Tokens refreshed successfully"
            });
        } else {
            return res.status(200).json({
                status: "success",
                message: "Tokens refreshed successfully",
                tokens: {
                    access_token,
                    refresh_token
                }
            });
        }
    } catch (err) {
        return res.status(400).json({
            status: "error",
            message: "Invalid refresh token"
        });
    }
}