import models from "../../models/index.model.js";

const { Profile } = models;

export const DeleteProfile = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.json({
            status: "error",
            message: "Profile id is required!"
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

        await Profile.destroy({ where: { id } });

        return res.status(204).end();
    } catch (err) {
        return res.status(500).json({
            status: "error",
            message: "Something went wrong",
            error: err.message
        });
    }
}