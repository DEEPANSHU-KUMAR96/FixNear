import nodemailer from "nodemailer";

export const isPasswordResetEmailConfigured = () => {
    const port = Number(process.env.SMTP_PORT);
    const frontendUrl = process.env.FRONTEND_URL;

    return Boolean(
        process.env.SMTP_HOST &&
        Number.isInteger(port) &&
        port > 0 &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS &&
        process.env.SMTP_FROM &&
        frontendUrl &&
        URL.canParse(frontendUrl)
    );
};

export const sendPasswordResetEmail = async (email, token) => {
    if (!isPasswordResetEmailConfigured()) {
        throw new Error("Password reset email settings are incomplete");
    }

    const port = Number(process.env.SMTP_PORT);
    const resetUrl = new URL("/reset-password", process.env.FRONTEND_URL);
    resetUrl.searchParams.set("token", token);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Reset your FixNear password",
        text: `Use this link to reset your password. It expires in 15 minutes:\n\n${resetUrl.toString()}\n\nIf you did not request this, you can ignore this email.`,
        html: `<p>Use the link below to reset your FixNear password. It expires in 15 minutes.</p><p><a href="${resetUrl.toString()}">Reset your password</a></p><p>If you did not request this, you can ignore this email.</p>`,
    });
};
