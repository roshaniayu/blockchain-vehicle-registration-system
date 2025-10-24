function successResponse(res, message, statusCode = 200, data = null) {
    return res.status(statusCode).json({
        status: 'success',
        message: message,
        data: data
    });
}
function errorResponse(res, message, statusCode = 500, details = null) {
    return res.status(statusCode).json({
        status: 'error',
        message: message,
        details: details
    });
}

module.exports = {
    successResponse,
    errorResponse
};
