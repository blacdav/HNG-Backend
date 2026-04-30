import { sequelize } from "../db/index.js";
import models from "../models/index.model.js";

const { RefreshToken } = models;

export const LogoutAuth = (req, res) => {
    // receives a json body with refresh token,
    // invalidates the refresh token in the database
    const { refresh_token, access_token } = req.body;

    try {
        // Invalidate the refresh token in the database (if you are storing them)
        // For example, you could have a RefreshToken model and set the token as invalid
        // await RefreshToken.update({ is_valid: false }, { where: { token: refresh_token } });

        if (req.headers["x-client-type"] === "web") {
            res.clearCookie("access_token");

            res.clearCookie("refresh_token");

            // return res.status(204).end()
        } else {
            req.body.refresh_token
        }

        // sequelize.transaction(async t => {
        //     await RefreshToken.update({
        //         version,
        //         where: { token },
        //         transaction: t
        //     })
        // })

        return res.status(204).end();
    } catch (err) {
        console.error("Error logging out:", err);
        return res.status(400).json({
            status: "error",
            message: "Error occurred while logging out"
        });
    }
}