import { Op } from "sequelize";
import models from "../../models/index.model.js";

const { Profile } = models;

const parseDateRange = (text) => {
    if (typeof text !== "string" || !text.trim()) return null;

    const normalized = text.trim().toLowerCase();
    const now = new Date();
    const start = new Date(now);
    let end = null;

    if (/\btoday\b/.test(normalized)) {
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(end.getDate() + 1);
    } else if (/\byesterday\b/.test(normalized)) {
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - 1);
        end = new Date(start);
        end.setDate(end.getDate() + 1);
    } else if (/\bthis\s+week\b/.test(normalized)) {
        const day = start.getDay();
        const mondayOffset = day === 0 ? -6 : 1 - day;
        start.setDate(start.getDate() + mondayOffset);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setDate(end.getDate() + 7);
    } else if (/\bthis\s+month\b/.test(normalized)) {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setMonth(end.getMonth() + 1);
    } else if (/\bthis\s+year\b/.test(normalized)) {
        start.setMonth(0, 0, 0);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end = new Date(start);
        end.setFullYear(end.getFullYear() + 1);
    }

    return end ? { start, end } : null;
};

const parseAgeRange = (text) => {
    if (typeof text !== "string" || !text.trim()) return null;

    const normalized = text.trim().toLowerCase();

    if (/\byoung\b/.test(normalized)) {
        return { min: 16, max: 24 };
    }

    const betweenMatch = normalized.match(/\bbetween\s+(\d{1,3})\s+(?:and|to)\s+(\d{1,3})\b/);
    if (betweenMatch) {
        return { min: Number(betweenMatch[1]), max: Number(betweenMatch[2]) };
    }

    const rangeMatch = normalized.match(/\b(\d{1,3})\s*(?:-|to)\s*(\d{1,3})\s*(?:years?|yrs?)\b/);
    if (rangeMatch) {
        return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) };
    }

    const minMatch = normalized.match(/\b(?:at least|from|older than|above)\s+(\d{1,3})\b/);
    const maxMatch = normalized.match(/\b(?:up to|at most|younger than|under|below)\s+(\d{1,3})\b/);

    if (minMatch || maxMatch) {
        return {
            min: minMatch ? Number(minMatch[1]) : undefined,
            max: maxMatch ? Number(maxMatch[1]) : undefined
        };
    }

    return null;
};

const parseAgeGroup = (text) => {
    if (typeof text !== "string" || !text.trim()) return null;

    const normalized = text.trim().toLowerCase();
    if (/\b(?:senior|elderly|old|aged)\b/.test(normalized)) {
        return "senior";
    }
    if (/\b(?:adult|adults)\b/.test(normalized)) {
        return "adult";
    }
    if (/\b(?:teenager|teenagers?|teens?|adolescent)\b/.test(normalized)) {
        return "teenager";
    }
    if (/\b(?:child|children|kid|kids)\b/.test(normalized)) {
        return "child";
    }

    return null;
};

const parseGender = (text) => {
    if (typeof text !== "string" || !text.trim()) return null;

    const normalized = text.trim().toLowerCase();
    if (/\b(?:male|female)\s+and\s+(?:male|female)\b/.test(normalized)) {
        return "both";
    }
    if (/\b(?:males?|men|boys?)\b/.test(normalized)) {
        return "male";
    }
    if (/\b(?:females?|women|girls?)\b/.test(normalized)) {
        return "female";
    }
    return null;
};

const parseCountry = (text) => {
    if (typeof text !== "string" || !text.trim()) return null;

    const normalized = text.trim().toLowerCase();
    const countryMatch = normalized.match(/\b(?:from|in)\s+([a-z]+(?:\s+[a-z]+)*)\b/i);
    if (countryMatch) {
        return countryMatch[1].trim();
    }
    return null;
};

const parseSort = (text) => {
    if (typeof text !== "string" || !text.trim()) return null;

    const normalized = text.trim().toLowerCase();
    const sortMatch = normalized.match(/\b(?:sort(?:ed)?\s+by|order\s+by)\s+(age|name|country|gender|registered|date)(?:\s+(asc|desc|ascending|descending))?\b/);
    if (!sortMatch) return null;

    const fieldMap = {
        age: "age",
        name: "name",
        country: "country_name",
        gender: "gender",
        registered: "createdAt",
        date: "createdAt"
    };

    const field = fieldMap[sortMatch[1]] || "createdAt";
    const order = /(asc|ascending)/.test(sortMatch[2]) ? "ASC" : "DESC";
    return { field, order };
};

const cleanSearchKeywords = (text) => {
    if (typeof text !== "string" || !text.trim()) return null;

    const cleaned = text
        .replace(/\bbetween\s+\d{1,3}\s+(?:and|to)\s+\d{1,3}\b/g, "")
        .replace(/\b\d{1,3}\s*(?:-|to)\s*\d{1,3}\s*(?:years?|yrs?)\b/g, "")
        .replace(/\b(?:at least|from|older than|above|up to|at most|younger than|under|below)\s+\d{1,3}\b/g, "")
        .replace(/\b(today|yesterday|this week|this month|this year)\b/g, "")
        .replace(/\bregistered\b/g, "")
        .replace(/\b(sort(?:ed)?\s+by|order\s+by)\b[^\b]*/g, "")
        .replace(/\byoung\b/g, "")
        .replace(/\b(?:from|in)\s+[a-z]+(?:\s+[a-z]+)*\b/g, "")
        .replace(/\b(?:male|female)\s+and\s+(?:male|female)\b/g, "")
        .replace(/\b(?:males?|females?|men|women|boys?|girls?)\b/g, "")
        .replace(/\b(?:senior|elderly|old|aged|adult|adults|teenager|teenagers?|teens?|adolescent|child|children|kids?)\b/g, "")
        .replace(/\b(people|accounts|profiles|show|find|list|profile|with|for|the|and|of|age|years?)\b/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();

    return cleaned.length > 0 ? cleaned : null;
};

const escapeCsvValue = (value) => {
    if (value === null || value === undefined) return "";
    const stringValue = String(value);
    if (/[",\n\r]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
};

export const ExportProfile = async (req, res) => {
    const { q, page = 1, limit = 20 } = req.query;
    const normalizedSearch = typeof q === "string" ? q.trim().toLowerCase() : "";

    if (!q || typeof q !== "string" || q.trim() === "") {
        return res.status(400).json({
            status: "error",
            message: "Query parameter 'q' is required and must be a non-empty string"
        });
    }

    const where = {};

    const ageRange = normalizedSearch ? parseAgeRange(normalizedSearch) : null;
    if (ageRange) {
        if (ageRange.min !== undefined && ageRange.max !== undefined) {
            where.age = { [Op.between]: [ageRange.min, ageRange.max] };
        } else if (ageRange.min !== undefined) {
            where.age = { [Op.gte]: ageRange.min };
        } else if (ageRange.max !== undefined) {
            where.age = { [Op.lte]: ageRange.max };
        }
    }

    const genderValue = normalizedSearch ? parseGender(normalizedSearch) : null;
    if (genderValue && genderValue !== "both") {
        where.gender = genderValue;
    }

    const ageGroupValue = normalizedSearch ? parseAgeGroup(normalizedSearch) : null;
    if (ageGroupValue) {
        where.age_group = ageGroupValue;
    }

    const countryValue = normalizedSearch ? parseCountry(normalizedSearch) : null;
    if (countryValue) {
        where.country_name = { [Op.like]: `%${countryValue}%` };
    }

    const dateRange = normalizedSearch ? parseDateRange(normalizedSearch) : null;
    if (dateRange) {
        where.createdAt = { [Op.between]: [dateRange.start, dateRange.end] };
    }

    const keywords = normalizedSearch ? cleanSearchKeywords(normalizedSearch) : null;
    if (keywords) {
        where[Op.or] = [
            { name: { [Op.like]: `%${keywords}%` } }
        ];
        if (!countryValue) {
            where[Op.or].push({ country_name: { [Op.like]: `%${keywords}%` } });
        }
    }

    const sortPayload = normalizedSearch ? parseSort(normalizedSearch) : null;
    const allowedSortFields = ["age", "createdAt", "name", "country_name", "gender"];
    const sortField = sortPayload?.field || "createdAt";
    const sortOrder = sortPayload?.order || "DESC";
    const safeSortField = allowedSortFields.includes(sortField) ? sortField : "createdAt";

    const incompletePatterns = /\b(?:above|below|from|at least|at most|up to|older than|younger than|between|sort(?:ed)?\s+by|order\s+by)\b/;
    const hasIncompletePatterns = incompletePatterns.test(normalizedSearch);

    if (hasIncompletePatterns) {
        const hasAgeIncomplete = /\b(?:above|below|from|at least|at most|up to|older than|younger than|between)\b/.test(normalizedSearch);
        const hasSortIncomplete = /\b(?:sort(?:ed)?\s+by|order\s+by)\b/.test(normalizedSearch);

        const ageFilterParsed = where.age !== undefined;
        const sortFilterParsed = sortPayload !== null;

        if (hasAgeIncomplete && !ageFilterParsed) {
            return res.status(400).json({
                status: "error",
                message: "Unable to interpret query"
            });
        }

        if (hasSortIncomplete && !sortFilterParsed) {
            return res.status(400).json({
                status: "error",
                message: "Unable to interpret query"
            });
        }
    }

    const hasFilters = Object.keys(where).length > 0;
    const hasKeywords = keywords !== null;
    if (!hasFilters && !hasKeywords) {
        return res.status(400).json({
            status: "error",
            message: "Unable to interpret query"
        });
    }

    try {
        const profiles = await Profile.findAll({
            where,
            order: [[safeSortField, sortOrder]]
        });

        const headers = [
            "id",
            "name",
            "gender",
            "gender_probability",
            "sample_size",
            "age",
            "age_group",
            "country_id",
            "country_name",
            "country_probability",
            "created_at",
            "updated_at"
        ];

        const csvRows = [headers.join(",")];

        profiles.forEach((profile) => {
            csvRows.push([
                escapeCsvValue(profile.id),
                escapeCsvValue(profile.name),
                escapeCsvValue(profile.gender),
                escapeCsvValue(profile.gender_probability),
                escapeCsvValue(profile.sample_size),
                escapeCsvValue(profile.age),
                escapeCsvValue(profile.age_group),
                escapeCsvValue(profile.country_id),
                escapeCsvValue(profile.country_name),
                escapeCsvValue(profile.country_probability),
                escapeCsvValue(profile.createdAt),
                escapeCsvValue(profile.updatedAt)
            ].join(","));
        });

        const csvContent = csvRows.join("\r\n");
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", "attachment; filename=profiles_export.csv");
        return res.status(200).send(csvContent);
    } catch (err) {
        console.error("Export error:", err);
        return res.status(500).json({
            status: "error",
            message: "Internal server error while exporting profiles"
        });
    }
};
