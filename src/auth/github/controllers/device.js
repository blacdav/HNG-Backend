import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import GitHubDeviceServices from "../services/device.js";

export const GitHubDeviceAuth = async (req, res) => {
    try {
        const deviceCodeResponse = await GitHubDeviceServices.getDeviceCode();

        // const credentials_path = path.join(os.homedir(), ".insighta", "credentials.json");

        // await fs.mkdir(path.dirname(credentials_path), { recursive: true });

        // await fs.writeFile(credentials_path, JSON.stringify({
        //     device_code: deviceCodeResponse.device_code,
        //     user_code: deviceCodeResponse.user_code,
        //     verification_uri: deviceCodeResponse.verification_uri
        // }));

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