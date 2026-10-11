import { body, validationResult } from "express-validator";

function validRequest(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
             errors: errors.array(),
            });
    }
    next();
}


export const registerValidator = [
    body("name").isLength({ min: 3 })
    .withMessage("name must be at least 3 characters long"),
    body("email")
    .isEmail()
    .withMessage("invalid email"),
    body("password")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters long"),
    validRequest

]

export const vailidLoginUser = [
    body('email')
    .isEmail()
    .withMessage('Email is required'),
    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
    validRequest
]

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