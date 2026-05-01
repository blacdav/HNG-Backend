import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import GitHubDeviceServices from "../services/device.js";

export const GitHubDeviceAuth = async (req, res) => {
    try {
        const deviceCodeResponse = await GitHubDeviceServices.getDeviceCode();

        return res.status(200).json({
            status: "success",
            message: "Device code generated successfully",
            data: deviceCodeResponse
        });
    } catch (err) {
        console.log("err object", err)
        throw err;
    }
}