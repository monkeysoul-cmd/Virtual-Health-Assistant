/**
 * Unified API Response Helper
 * Enforces consistent JSend/REST envelope across all backend endpoints.
 */

const HTTP_STATUS = require('../constants/httpCodes');

const apiResponse = {
  /**
   * Return successful response
   */
  success(res, data = {}, message = 'Success', statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Return error response
   */
  error(res, error = 'An error occurred', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, details = null) {
    return res.status(statusCode).json({
      success: false,
      error: typeof error === 'string' ? error : error.message || 'Server error',
      details,
      timestamp: new Date().toISOString(),
    });
  },
};

module.exports = apiResponse;
