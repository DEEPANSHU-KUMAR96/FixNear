import multer from "multer";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedImageTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
]);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_IMAGE_SIZE,
        files: 1,
    },
    fileFilter: (_req, file, callback) => {
        if (!allowedImageTypes.has(file.mimetype)) {
            return callback(new Error("Only JPG, PNG, WEBP, GIF, and AVIF images are allowed"));
        }
        return callback(null, true);
    },
});

export const parseIssueImage = (req, res, next) => {
    upload.single("image")(req, res, (error) => {
        if (!error) {
            return next();
        }

        if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                success: false,
                message: "Image must be 5 MB or smaller",
            });
        }

        return res.status(400).json({
            success: false,
            message: error.message || "Invalid image upload",
        });
    });
};
