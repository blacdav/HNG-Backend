import models from "../models/index.model.js";

const { User } = models;

export const MeAuth = async (req, res) => {
    const { github_id } = req.user;

    const profile = await User.findOne({ where: { github_id } })

    if (!profile) {
        return res.status(404).json({
            status: "error",
            message: "User not found"
        })
    }

    return res.status(200).json({
        status: "success",
        message: "User information retrieved successfully",
        data: profile
    });
}