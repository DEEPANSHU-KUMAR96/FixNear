import { body, validationResult } from "express-validator";

function validRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorList = errors.array();
        const message = errorList.map((e) => e.msg).join(". ");
        return res.status(400).json({
            message,
            errors: errorList,
        });
    }
    next();
}

export const registerValidator = [
    body("name")
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("Name must be between 3 and 20 characters long"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    validRequest
];

export const vailidLoginUser = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('A valid email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    validRequest
];

export const forgotPasswordValidator = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("A valid email is required")
        .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false }),
    validRequest,
];

export const resetPasswordValidator = [
    body("token")
        .trim()
        .notEmpty()
        .withMessage("Reset token is required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    validRequest,
];
