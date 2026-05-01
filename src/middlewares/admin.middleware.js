import models from "../models/index.model.js";

const { User } = models;

export const AdminAuth = (req, res, next) => {
    const { role } = req.user;

    if (!role || role === "") {
        return res.status(404).json({
            status: "error",
            message: "Session Compromized, role not passed"
        })
    }
    
    if (role !== "admin") {
        return res.status(403).json({
            status: "failed",
            message: "This permission is reserved for only admin"
        });
    }

    return next()
}