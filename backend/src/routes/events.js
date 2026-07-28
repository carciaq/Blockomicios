const express = require('express');
const router = express.Router();
const { getEvents } = require('../services/election');

router.get('/', (req, res) => {
  res.json(getEvents());
});

module.exports = router;
