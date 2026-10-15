import * as service from "./auth.service";
export const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await service.loginUser(username, password);
        return res.json(result);
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
export const verifyActivationController = async (req, res) => {
    try {
        const { activation_code } = req.body;
        const result = await service.verifyActivationCode(activation_code);
        return res.json(result);
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
export const completeRegistrationController = async (req, res) => {
    try {
        const { member_id, username, password } = req.body;
        const result = await service.completeRegistration(member_id, username, password);
        return res.json(result);
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await service.sendForgotPasswordOtp(email);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const verifyOtpController = async (req, res) => {
    try {
        const { email, code } = req.body;
        const result = await service.verifyForgotPasswordOtp(email, code);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
export const resetPasswordController = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const result = await service.resetPassword(email, newPassword);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
