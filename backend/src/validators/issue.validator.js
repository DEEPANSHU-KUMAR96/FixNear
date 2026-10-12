import { body, validationResult } from "express-validator";

const validRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    return next();
};

export const createIssueValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 20 })
        .withMessage("Title cannot be longer than 20 characters"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 200 })
        .withMessage("Description cannot be longer than 200 characters"),
    body("category")
        .isIn(["Garbage", "Road", "Streetlight", "Water"])
        .withMessage("Category must be Garbage, Road, Streetlight, or Water"),
    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required"),
    body("status")
        .isIn(["Reported", "In Progress", "Resolved"])
        .withMessage("Status must be Reported, In Progress, or Resolved"),
    body("priority")
        .isIn(["Low", "Medium", "High"])
        .withMessage("Priority must be Low, Medium, or High"),
    validRequest,
];
