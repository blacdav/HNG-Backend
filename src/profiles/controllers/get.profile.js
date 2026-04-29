import models from "../../models/index.model.js";

const { Profile } = models;

export const GetProfile = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            status: "error",
            message: "id param is required"
        })
    }

    try {
        const profile = await Profile.findByPk(id);

        if (!profile) {
            return res.status(404).json({
                status: "error",
                message: "Profile not found!"
            })
        }

        return res.status(200).json({
            status: "success",
            data: profile
        })
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: err.message
        });
    }
}