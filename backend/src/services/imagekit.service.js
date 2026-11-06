import { randomUUID } from "node:crypto";
import ImageKit, { toFile } from "@imagekit/nodejs";
import { config } from "../config/config.js";

let imageKitClient;

const getImageKitClient = () => {
    if (!config.IMAGEKIT_PRIVATE_KEY) {
        const error = new Error("ImageKit private key is not configured");
        error.code = "IMAGEKIT_NOT_CONFIGURED";
        throw error;
    }

    if (!imageKitClient) {
        imageKitClient = new ImageKit({ privateKey: config.IMAGEKIT_PRIVATE_KEY });
    }

    return imageKitClient;
};

const IMAGE_EXTENSIONS = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
};

export const uploadIssueImage = async (file) => {
    const fileName = `issue-${randomUUID()}.${IMAGE_EXTENSIONS[file.mimetype]}`;
    const imageKit = getImageKitClient();
    const response = await imageKit.files.upload({
        file: await toFile(file.buffer, fileName, { type: file.mimetype }),
        fileName,
        folder: "/fixnear/issues",
        useUniqueFileName: false,
    });

    if (!response.url) {
        throw new Error("ImageKit upload response did not include a URL");
    }

    return { url: response.url };
};
