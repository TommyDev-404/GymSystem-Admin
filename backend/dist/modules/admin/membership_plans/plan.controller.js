import * as service from "./plan.service";
export const getPlansController = async (req, res) => {
    try {
        const plans = await service.getPlansService();
        return res.status(200).json(plans);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
export const createPlanController = async (req, res) => {
    try {
        const result = await service.createPlanService(req.body);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
export const updatePlanController = async (req, res) => {
    try {
        const result = await service.updatePlansService(req.body);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
export const deletePlanController = async (req, res) => {
    try {
        const result = await service.deletePlanService(Number(req.params.plan_id));
        return res.json(result);
    }
    catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
