import * as service from "./payments.service";
export const getPaymentsSummaryController = async (req, res) => {
    try {
        const summary = await service.getPaymentSummaryService();
        return res.json(summary);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch payments summary" });
    }
};
export const getPaymentsController = async (req, res) => {
    try {
        const payments = await service.getPaymentsService(req.query);
        return res.json(payments);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch payments" });
    }
};
