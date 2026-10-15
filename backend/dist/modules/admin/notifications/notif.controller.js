import * as service from "./notif.service";
export const getAllNotificationsController = async (req, res) => {
    try {
        const data = await service.getAllNotificationsService();
        return res.status(201).json(data);
    }
    catch (err) {
        return res.status(400).json({
            message: err.message || "Failed to fetch all notifications",
        });
    }
};
export const getNotificationCountController = async (req, res) => {
    try {
        const data = await service.getNotificationCountService();
        return res.status(200).json(data);
    }
    catch (err) {
        return res.status(400).json({
            message: err.message || "Failed to fetch notification count",
        });
    }
};
export const markNotifAsReadController = async (req, res) => {
    try {
        const result = await service.markNotificationAsReadService(Number(req.params.notif_id));
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(400).json({
            message: err.message || "Failed to mark notification as read",
        });
    }
};
export const markAllNotifAsReadController = async (req, res) => {
    try {
        const result = await service.markAllNotificationsAsReadService();
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(400).json({
            message: err.message || "Failed to mark all notifications as read",
        });
    }
};
export const deleteNotificationController = async (req, res) => {
    try {
        const result = await service.deleteNotificationService(Number(req.params.notif_id));
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(400).json({
            message: err.message || "Failed to delete notification",
        });
    }
};
