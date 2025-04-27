const MediaUpload = require("../../../models/common/MediaUpload");
const {
    successResp,
    failResp,
    logDbTransaction,
    getUrlFromImagePath,
    parseMongooseValidationError,
} = require("../../../utils");

exports.saveprofilePicInDB = async (req, res) => {
    try {
        const { media } = req;
        const {
            type,
            originalFileName,
            uploadedFilePath,
            uploadedBy,
            role,
            kind,
            src, // src
            isActive,
            processingTime,
        } = media;

        const [getDefaultImage] = src;

        const object = {
            type,
            sizeInBytes: getDefaultImage.sizeInBytes,
            defaultSource: getDefaultImage.src,
            extension: getDefaultImage.extension,
            originalFileName,
            uploadedFilePath,
            uploadedBy,
            role,
            kind,
            src,
            isActive,
        };

        const newMedia = new MediaUpload(object);
        const saved = await newMedia.save();

        await logDbTransaction(
            "CREATE",
            "MediaUpload",
            saved._id,
            req.tokenUserData?.id,
            "Media uploaded",
            {
                processingTime,
            }
        );

        // update user document
        // @TODO: update user document with the new profile picture

        const responseData = {
            uploadedBy: saved.uploadedBy,
            role: saved.role,
            kind: saved.kind,
            src: saved.src?.map((item) => ({
                src: getUrlFromImagePath(item.src),
                size: item.size,
                sizeInKB: Math.ceil(item.sizeInBytes / 1024),
                // path: "",
                extension: item.extension,
                width: item.width,
                height: item.height,
                _id: item._id,
            })),
            isActive: saved.isActive,
            originalFileName: saved.originalName,
            type: saved.type,
            _id: saved._id,
        };

        return successResp(
            res,
            201,
            { media: responseData },
            "Media uploaded successfully"
        );
    } catch (error) {
        console.error("Media upload failed:", error, parseMongooseValidationError(error));
        return failResp(res, 500, "Failed to save media", "MEDIA_SAVE_FAILED");
    }
}