const express = require('express');
const router = express.Router();
const cardsController = require('../controllers/CardsController');

// Get cards data
router.get('/', cardsController.getCardsData);

module.exports = router;
