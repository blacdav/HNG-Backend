import { ghConfig } from "../../../config/index.js";

export default class GitHubDeviceServices {
    // this service will handle the device flow for github authentication
    // it will generate a device code and a user code, and return them to the client
    // it will also poll the github api to check if the user has authorized the device

    static {
        this.baseUrl = "https://github.com";
        this.client_id = ghConfig.clientId;
    }

    static async getDeviceCode() {
        // generate a device code and a user code, and return them to the client
        try {
            const response = await fetch(`${this.baseUrl}/login/device/code`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_id: this.client_id,
                    scope: "user:email"
                })
            });

            return await response.json();
        } catch (err) {
            console.error("Error fetching device code:", err);
            throw err;
        }
    }

    static async getTokenForDevice(device_code) {
        try {
            const response = await fetch(`${this.baseUrl}/login/oauth/access_token`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_id: this.client_id,
                    device_code,
                    grant_type: "urn:ietf:params:oauth:grant-type:device_code"
                })
            });

            return await response.json();
        } catch (err) {
            throw err;
        }
    }
}