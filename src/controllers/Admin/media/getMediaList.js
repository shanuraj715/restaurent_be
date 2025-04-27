const MediaUpload = require("../../../models/common/MediaUpload");
const { successResp, failResp, getUrlFromImagePath } = require("../../../utils");
const { VALID_MEDIA_TYPES } = require("../../../constants");

exports.getMediaList = async (req, res) => {
    try {
        const { type, page = 1, limit = 40 } = req.query;

        const validTypes = VALID_MEDIA_TYPES;
        if (!type || !validTypes.includes(type)) {
            return failResp(
                res,
                400,
                "Invalid or missing 'type'",
                "INVALID_MEDIA_TYPE"
            );
        }

        const filter = { type: type };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await MediaUpload.countDocuments(filter);
        const mediaList = await MediaUpload.find(filter).populate("uploadedBy", "name email").lean()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // const respObject = {
        //     ...mediaList,
        //     defaultSource: getUrlFromImagePath(mediaList.defaultSource),
        //     src: mediaList.src?.map((item) => {
        //         return {
        //             ...item,
        //             src: getUrlFromImagePath(item.src),
        //         };
        //     }),
        // }

        const respMediaArray = mediaList.map((item) => {
            return {
                ...item,
                defaultSource: getUrlFromImagePath(item.defaultSource),
                src: item.src?.map((srcItem) => {
                    return {
                        ...srcItem,
                        src: getUrlFromImagePath(srcItem.src),
                    };
                }),
            };
        });
        // console.log("mediaList", mediaList)
        console.log(respMediaArray)

        return successResp(res, 200, {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            pages: Math.ceil(total / limit),
            media: respMediaArray,
        }, "Fetched media list successfully");
    } catch (err) {
        console.error("Failed to fetch media list:", err);
        return failResp(res, 500, "Failed to fetch media list", "MEDIA_LIST_FETCH_ERROR");
    }
};