import { sequelize } from "../../../db/index.js";
import models from "../../../models/index.model.js";
import GitHubDeviceServices from "../services/device.js";
import TokenService from "../services/tokens.js";
import GitHubWebServices from "../services/web.js";

const { User } = models;

export const GhCallbackAuth = async (req, res) => {
    const { code, state } = req.query;

    // Verify the state parameter to prevent CSRF attacks
    const storedState = req.cookies.gh_oauth_state;
    
    if (!storedState.state || state !== storedState.state) {
        return res.status(400).json({
            status: "error",
            message: "Invalid state parameter"
        });
    }

    try {
        const token = await GitHubWebServices.exchangeCodeForToken(code, storedState.code_verifier);

        const user_info = await GitHubWebServices.getUserInfo(token.access_token);

        const [user, created] = await sequelize.transaction(async t => {
            return await User.findOrCreate({
                where: { github_id: user_info.id },
                defaults: {
                    github_id: user_info.id,
                    username: user_info.login,
                    email: user_info.email,
                    avatar_url: user_info.avatar_url,
                    role: user_info.email === "davidaniefoik@gmail.com" ? "admin" : null,
                    last_login_at: new Date()
                },
                transaction: t
            })
        });

        const access_token = await TokenService.genAccessToken({ github_id: user_info.id, role: user.role });

        const refresh_token = await TokenService.genRefreshToken({ github_id: user_info.id });

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3 * 60 * 1000
        });

        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/api/auth/refresh",
            maxAge: 5 * 60 * 1000
        });

        return res.redirect("http://localhost:5173/dashboard")
    } catch (err) {
        console.log("err object", err);
        throw err;
    }
}

export const GhDeviceCallbackAuth = async (req, res) => {
    const { device_code } = req.body;

    if (!device_code) {
        return res.status(400).json({
            status: "error",
            message: "Device code not found in cookies"
        });
    }

    try {
        const tokenResponse = await GitHubDeviceServices.getTokenForDevice(device_code);
        if (tokenResponse.error) {
            return res.status(400).json({
                status: `${tokenResponse.error}`,
                message: tokenResponse.error_description
            });
        }

        const user_info = await GitHubWebServices.getUserInfo(tokenResponse.access_token);

        const [user, created] = await sequelize.transaction(async t => {
            return await User.findOrCreate({
                where: { github_id: user_info.id },
                defaults: {
                    github_id: user_info.id,
                    username: user_info.login,
                    email: user_info.email,
                    avatar_url: user_info.avatar_url,
                    role: user_info.email === "davidaniefoik@gmail.com" ? "admin" : null,
                    last_login_at: new Date()
                },
                transaction: t
            })
        });

        const access_token = await TokenService.genAccessToken({ github_id: user_info.id, role: user.role });
        const refresh_token = await TokenService.genRefreshToken({ github_id: user_info.id });

        return res.status(200).json({
            status: "success",
            message: "User Authenticated successfully",
            data: user,
            tokens: {
                access_token,
                refresh_token
            }
        });
    } catch (err) {
        console.log("err object", err);
        throw err;
    }
}