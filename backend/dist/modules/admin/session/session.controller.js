import * as service from "./session.service";
export const createSessionController = async (req, res) => {
    try {
        const session = await service.createDailySessionService();
        return res.status(201).json(session);
    }
    catch (error) {
        const err = error;
        return res.status(err.status || 500).json({
            message: err.message || "Server error"
        });
    }
};
export const getTodayQrController = async (req, res) => {
    try {
        const qr = await service.getTodayQrService();
        return res.status(200).json({ qr });
    }
    catch (error) {
        const err = error;
        return res.status(err.status || 500).json({
            message: err.message || "Server error"
        });
    }
};
