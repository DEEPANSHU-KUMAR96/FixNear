import dotenv from "dotenv";
dotenv.config();


if (!process.env.PORT) {
    throw new Error("PORT is not defined");
}

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined")
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined")
}

if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not defined")
}
if (!process.env.SMTP_USER) {
    throw new Error("SMTP_USER is not defined")
}
if (!process.env.SMTP_PASS) {
    throw new Error("SMTP_PASS is not defined")
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_SECRET is not defined")
}
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not defined")
}
if (!process.env.FRONTEND_URL) {
    throw new Error("FRONTEND_URL is not defined")
}
if (!process.env.GOOGLE_REDIRECT_URI) {
    throw new Error("GOOGLE_REDIRECT_URI is not defined")
}

export const config = {

    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    GOOLE_CLIENT_SECRET: process.env.GOOLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
    FRONTEND_URL: process.env.GOOGLE,
    NODE_ENV: process.env.NODE_ENV

}