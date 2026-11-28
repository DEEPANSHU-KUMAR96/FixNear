import { randomBytes } from "node:crypto";
import { google } from "googleapis";
import { config } from "../config/config.js";

const oauth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: config.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
});

const encodeMimeBody = (value) => Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/.{1,76}/g, "$&\r\n")
    .replace(/\r\n$/, "");

const createMimeMessage = ({ to, subject, text, html }) => {
    const headers = [config.GMAIL_SENDER_EMAIL, to, subject];
    if (headers.some((value) => typeof value !== "string" || /[\r\n]/.test(value))) {
        throw new TypeError("Email headers must be valid single-line strings");
    }

    const parts = [];
    if (typeof text === "string") {
        parts.push({ contentType: "text/plain", content: text });
    }
    if (typeof html === "string") {
        parts.push({ contentType: "text/html", content: html });
    }
    if (parts.length === 0) {
        throw new TypeError("Email must include a text or HTML body");
    }

    const mimeHeaders = [
        `From: ${config.GMAIL_SENDER_EMAIL}`,
        `To: ${to}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
    ];

    let mimeBody;
    if (parts.length === 1) {
        mimeHeaders.push(
            `Content-Type: ${parts[0].contentType}; charset=UTF-8`,
            "Content-Transfer-Encoding: base64"
        );
        mimeBody = encodeMimeBody(parts[0].content);
    } else {
        const boundary = `fixnear_${randomBytes(16).toString("hex")}`;
        mimeHeaders.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
        mimeBody = [
            ...parts.flatMap(({ contentType, content }) => [
                `--${boundary}`,
                `Content-Type: ${contentType}; charset=UTF-8`,
                "Content-Transfer-Encoding: base64",
                "",
                encodeMimeBody(content),
            ]),
            `--${boundary}--`,
        ].join("\r\n");
    }

    return `${mimeHeaders.join("\r\n")}\r\n\r\n${mimeBody}`;
};

const getFailureCategory = (error) => {
    const status = error?.response?.status;
    const apiError = error?.response?.data?.error;
    const reason = error?.response?.data?.error?.errors?.[0]?.reason;
    const quotaReasons = ["rateLimitExceeded", "userRateLimitExceeded", "quotaExceeded"];

    if (apiError === "invalid_grant" || error?.message === "invalid_grant" || status === 401) {
        return "oauth_authorization_failed";
    }
    if (status === 429 || (status === 403 && quotaReasons.includes(reason))) {
        return "gmail_quota_exceeded";
    }
    if (status === 403) {
        return "gmail_api_forbidden";
    }
    return "gmail_api_request_failed";
};

export const isPasswordResetEmailConfigured = () => {
    if (
        !config.GOOGLE_CLIENT_ID ||
        !config.GOOGLE_CLIENT_SECRET ||
        !config.GOOGLE_REDIRECT_URI ||
        !config.GMAIL_REFRESH_TOKEN ||
        !config.GMAIL_SENDER_EMAIL ||
        !config.FRONTEND_URL ||
        !URL.canParse(config.FRONTEND_URL)
    ) {
        return false;
    }

    return config.NODE_ENV !== "production"
        || new URL(config.FRONTEND_URL).protocol === "https:";
};

export const sendEmail = async ({ to, subject, text, html }) => {
    const raw = Buffer.from(
        createMimeMessage({ to, subject, text, html }),
        "utf8"
    ).toString("base64url");

    try {
        const response = await gmail.users.messages.send({
            userId: "me",
            requestBody: { raw },
        });

        if (!response.data?.id) {
            throw new Error("Gmail API did not confirm the sent message");
        }

        return response.data;
    } catch (error) {
        console.error("Gmail API email delivery failed:", {
            category: getFailureCategory(error),
            status: error?.response?.status,
        });
        throw new Error("Gmail API email delivery failed");
    }
};

export const sendPasswordResetEmail = async (email, token) => {
    if (!isPasswordResetEmailConfigured()) {
        throw new Error("Password reset email settings are incomplete");
    }

    const resetUrl = new URL("/reset-password", config.FRONTEND_URL);
    if (config.NODE_ENV === "production" && resetUrl.protocol !== "https:") {
        throw new Error("Password reset links must use HTTPS in production");
    }
    resetUrl.searchParams.set("token", token);

    await sendEmail({
        to: email,
        subject: "Reset your FixNear password",
        text: `Use this link to reset your password. It expires in 15 minutes:\n\n${resetUrl.toString()}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>Use the link below to reset your FixNear password. It expires in 15 minutes.</p><p><a href="${resetUrl.toString()}">Reset your password</a></p><p>If you did not request this, you can ignore this email.</p>`,
    });
};
