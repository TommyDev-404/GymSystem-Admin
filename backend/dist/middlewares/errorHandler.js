export class AppError extends Error {
    message;
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
export const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    console.error(err);
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};
