/**
 * Virtual Doctor Conversational Chat Routes
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { validateChatMessage } = require('../middleware/validate');
const rateLimiter = require('../middleware/rateLimiter');

// POST /api/chat - Converse with Dr. Amit Patel AI assistant
router.post('/', rateLimiter, validateChatMessage, chatController.handleChat);

module.exports = router;
