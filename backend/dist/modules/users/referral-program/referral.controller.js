import * as service from "./referral.service";
export const getMemberReferralDataController = async (req, res) => {
    try {
        const data = await service.getMemberReferralDataService(Number(req.params.member_id));
        return res.status(201).json(data);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            message: err.message || "Failed to retrieve member referral data",
        });
    }
};
export const getMemberReferralRecordsController = async (req, res) => {
    try {
        const data = await service.getMemberReferralRecordsService(Number(req.params.member_id));
        return res.status(201).json(data);
    }
    catch (err) {
        console.log(err);
        return res.status(400).json({
            message: err.message || "Failed to retrieve member referral records",
        });
    }
};
