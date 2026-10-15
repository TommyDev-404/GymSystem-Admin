import * as service from "./members.service";
export const getMembersSummaryController = async (req, res) => {
    try {
        const data = await service.getMemberSummaryService();
        return res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message || "Failed to fetch members summary",
        });
    }
};
export const getMembersController = async (req, res) => {
    try {
        const data = await service.getMembersService(req.query);
        return res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message || "Failed to fetch members",
        });
    }
};
export const createMemberController = async (req, res) => {
    try {
        const result = await service.createMemberService(req.body);
        return res.status(201).json(result);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            message: err.message || "Failed to create member",
        });
    }
};
export const upgradeMembershipPlanController = async (req, res) => {
    try {
        const result = await service.upgradeMembershipPlanService(Number(req.params.member_id), req.body.data);
        return res.status(200).json(result);
    }
    catch (err) {
        return res.status(400).json({
            message: err.message || "Failed to update member",
        });
    }
};
export const resendActivationController = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await service.resendActivationCodeService(email);
        return res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            message: error.message || "Failed to resend activation code",
        });
    }
};
export const renewMembershipController = async (req, res) => {
    try {
        const result = await service.renewMembershipServiceService(req.body);
        return res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({
            message: error.message || "Failed to renew membership",
        });
    }
};
export const getMemberPaymentHistoryController = async (req, res) => {
    try {
        const member_id = Number(req.params.member_id);
        const month = req.query.month ? Number(req.query.month) : undefined;
        const year = req.query.year ? Number(req.query.year) : undefined;
        if (!Number.isInteger(member_id) || member_id <= 0) {
            return res.status(400).json({
                message: "Invalid member ID",
            });
        }
        if ((month !== undefined &&
            (!Number.isInteger(month) || month < 1 || month > 12)) ||
            (year !== undefined &&
                (!Number.isInteger(year) || year < 1)) ||
            (month !== undefined && year === undefined)) {
            return res.status(400).json({
                message: "A valid year is required when filtering by month.",
            });
        }
        const result = await service.getMemberPaymentHistory(member_id, {
            month,
            year,
        });
        return res.status(200).json(result);
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Failed to fetch member payment history";
        return res.status(500).json({ message });
    }
};
