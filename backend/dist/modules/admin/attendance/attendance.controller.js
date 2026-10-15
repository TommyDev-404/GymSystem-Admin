import * as service from "./attendance.service";
export const getAttendanceController = async (req, res) => {
    try {
        const { year, month, day } = req.query;
        const data = await service.getAttendanceService({
            year: year ? Number(year) : undefined,
            month: month ? Number(month) : undefined,
            day: day ? Number(day) : undefined
        });
        return res.status(200).json(data);
    }
    catch (error) {
        return res.status(error.status || 500).json({
            message: error.message || "Server error"
        });
    }
};
export const markCheckoutController = async (req, res) => {
    try {
        const result = await service.markCheckoutService(Number(req.params.attendance_id));
        console.log(result);
        return res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        return res.status(error.status || 500).json({
            message: error.message || "Server error"
        });
    }
};
