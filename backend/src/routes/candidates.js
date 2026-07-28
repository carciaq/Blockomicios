const express = require('express');
const router = express.Router();
const { getCandidatesByEvent } = require('../services/election');

router.get('/', (req, res) => {
  const eventId = req.query.eventId ? Number(req.query.eventId) : null;
  const candidates = eventId ? getCandidatesByEvent(eventId) : [];
  res.json(candidates);
});

module.exports = router;
