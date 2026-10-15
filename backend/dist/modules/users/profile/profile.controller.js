import * as service from "./profile.service";
export const getProfileInfoController = async (req, res) => {
    try {
        const userId = Number(req.params.user_id);
        const result = await service.getProfileService(userId);
        res.status(result ? 200 : 400).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
        });
    }
};
export const updateProfileInfoController = async (req, res) => {
    try {
        const userId = Number(req.params.user_id);
        const { username, email } = req.body;
        const result = await service.updateProfileInfoService(userId, {
            username,
            email,
        });
        res.status(result ? 200 : 400).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
        });
    }
};
export const updateProfileImageController = async (req, res) => {
    try {
        const userId = Number(req.params.user_id);
        if (!req.file) {
            return res.status(400).json({
                message: "Profile image is required",
            });
        }
        const result = await service.updateProfileImageService(userId, req.file);
        return res.status(result ? 200 : 400).json(result);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            message: err.message || "Failed to update profile",
        });
    }
};
