/**
 * Virtual Doctor Chat Controller
 */

const chatService = require('../services/chatService');

async function handleChat(req, res, next) {
  try {
    const { message, history } = req.body;
    const apiKey = req.headers['x-gemini-api-key'] || req.body.apiKey;

    const response = await chatService.processDoctorChat({
      message,
      history,
      apiKey
    });

    res.json({
      success: true,
      data: response
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleChat
};
