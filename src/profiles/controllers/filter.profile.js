import { Op } from "sequelize";
import models from "../../models/index.model.js";

const { Profile } = models;

export const FilterProfile = async (req, res) => {
    try {
        // Parse and validate query parameters
        const {
            age_group,
            gender,
            country_id,
            min_age,
            max_age,
            min_gender_probability,
            min_country_probability,
            sort_by = "gender_probability",
            order = "asc",
            page = 1,
            limit = 10
        } = req.query;

        // Validate and sanitize pagination
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10)); // Max 100 items per page
        const offset = (pageNum - 1) * limitNum;

        // Validate sort parameters
        const allowedSortFields = ["gender_probability", "country_probability", "age", "createdAt", "name"];
        const safeSortBy = allowedSortFields.includes(sort_by) ? sort_by : "gender_probability";
        const safeOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";

        // Check if any filters are provided
        const hasFilters = age_group || gender || country_id || min_age || max_age ||
                          min_gender_probability || min_country_probability;

        // If no filters, return all profiles with pagination
        if (!hasFilters) {
            const { count, rows: profiles } = await Profile.findAndCountAll({
                offset,
                limit: limitNum,
                order: [[safeSortBy, safeOrder]]
            });

            return res.status(200).json({
                status: "success",
                count,
                data: profiles
            });
        }

        // Build filter object
        const filter = {};

        // Age group filter
        if (typeof age_group === "string" && age_group.trim()) {
            filter.age_group = age_group.trim().toLowerCase();
        }

        // Gender filter
        if (typeof gender === "string" && gender.trim()) {
            filter.gender = gender.trim().toLowerCase();
        }

        // Country filter
        if (typeof country_id === "string" && country_id.trim()) {
            filter.country_id = country_id.trim().toUpperCase();
        }

        // Age range filter - handle min/max properly
        const minAgeNum = min_age !== undefined && min_age !== "" ? parseInt(min_age, 10) : null;
        const maxAgeNum = max_age !== undefined && max_age !== "" ? parseInt(max_age, 10) : null;

        if (minAgeNum !== null && maxAgeNum !== null) {
            // Both min and max provided
            if (minAgeNum <= maxAgeNum) {
                filter.age = { [Op.between]: [minAgeNum, maxAgeNum] };
            } else {
                return res.status(400).json({
                    status: "error",
                    message: "min_age cannot be greater than max_age"
                });
            }
        } else if (minAgeNum !== null) {
            // Only min provided
            filter.age = { [Op.gte]: minAgeNum };
        } else if (maxAgeNum !== null) {
            // Only max provided
            filter.age = { [Op.lte]: maxAgeNum };
        }

        // Probability filters with validation
        if (min_gender_probability !== undefined && min_gender_probability !== "") {
            const prob = parseFloat(min_gender_probability);
            if (isNaN(prob) || prob < 0 || prob > 1) {
                return res.status(400).json({
                    status: "error",
                    message: "min_gender_probability must be a number between 0 and 1"
                });
            }
            filter.gender_probability = { [Op.gte]: prob };
        }

        if (min_country_probability !== undefined && min_country_probability !== "") {
            const prob = parseFloat(min_country_probability);
            if (isNaN(prob) || prob < 0 || prob > 1) {
                return res.status(400).json({
                    status: "error",
                    message: "min_country_probability must be a number between 0 and 1"
                });
            }
            filter.country_probability = { [Op.gte]: prob };
        }

        // Execute query
        const { count, rows: profiles } = await Profile.findAndCountAll({
            offset,
            limit: limitNum,
            where: filter,
            order: [[safeSortBy, safeOrder]]
        });

        // Check if no profiles match the filters
        if (count === 0) {
            return res.status(404).json({
                status: "error",
                message: "No profiles found matching the specified filters"
            });
        }

        return res.status(200).json({
            status: "success",
            page,
            limit,
            total: count,
            total_pages: Math.ceil(count / limit),
            links: {
                self: req.url
            },
            data: profiles
        });

    } catch (err) {
        console.error("Filter error:", err);
        return res.status(500).json({
            status: "error",
            message: "Internal server error while filtering profiles"
        });
    }
};