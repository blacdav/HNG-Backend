import { genderize } from "../../classify.js";

export const GetClassify = async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({
            status: "error",
            message: "Name query parameter is required."
        });
    }

    if (typeof name !== "string" || name.trim() === "") {
        return res.status(422).json({
            status: "error",
            message: "Name must be a non-empty string."            
        });
    }

    try {
        const result = await genderize(name);

        if (!result) {
            return res.status(200).json({
                status: "error",
                message: "Unable to classify the name."
            });
        }

        if (result.error) {
            return res.json({
                status: "error",
                message: `${result.error}`
            })
        }

        if (!result.gender) {
            return res.json({
                status: "error",
                message: "No prediction available for the provided name"
            })
        }

        const is_confident = result.probability >= 0.7 && result.count >= 100 ? true : false;

        return res.status(200).json({
            status: "success",
            data: {
                name: result.name,
                gender: result.gender,
                probability: result.probability,
                sample_size: result.count,
                is_confident,
                processed_at: new Date().toISOString()
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Server Failure"
        });
    }
}