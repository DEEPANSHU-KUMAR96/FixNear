import { body, validationResult } from "express-validator";

const validRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorList = errors.array();
        return res.status(400).json({
            success: false,
            message: errorList.map((e) => e.msg).join('. '),
            errors: errorList,
        });
    }
    return next();
};

export const createIssueValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 50 })
        .withMessage("Title cannot be longer than 50 characters"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 500 })
        .withMessage("Description cannot be longer than 500 characters"),
    body("category")
        .isIn(["Garbage", "Road", "Streetlight", "Water", "Pothole", "Sanitation"])
        .withMessage("Category must be Garbage, Road, Streetlight, or Water"),
    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required"),
    body("status")
        .optional()
        .isIn(["Reported", "In Progress", "Resolved"])
        .withMessage("Status must be Reported, In Progress, or Resolved"),
    body("priority")
        .optional()
        .isIn(["Low", "Medium", "High"])
        .withMessage("Priority must be Low, Medium, or High"),
    validRequest,
];
