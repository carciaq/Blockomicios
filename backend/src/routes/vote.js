const express = require('express');
const router = express.Router();
const chain = require('../services/chain');
const { isValidColombianVoterId, isValidEventId } = require('../services/validation');
const { getEventById, getCandidateById } = require('../services/election');

router.post('/', async (req, res) => {
  try {
    const { voterId, eventId, candidateId, encryptedData } = req.body;
    if (!voterId || typeof eventId !== 'number' || typeof candidateId !== 'number' || !encryptedData) {
      return res.status(400).json({ error: 'voterId, eventId, candidateId and encryptedData are required' });
    }

    if (!isValidColombianVoterId(voterId)) {
      return res.status(400).json({ error: 'Invalid Colombian voter ID format.' });
    }

    if (!isValidEventId(eventId)) {
      return res.status(400).json({ error: 'Invalid event ID.' });
    }

    const event = getEventById(eventId);
    if (!event) {
      return res.status(400).json({ error: 'Event does not exist.' });
    }

    const candidate = getCandidateById(candidateId);
    if (!candidate || candidate.eventId !== eventId) {
      return res.status(400).json({ error: 'Candidate does not belong to the selected event.' });
    }

    const tx = await chain.castVote(voterId, eventId, candidateId, encryptedData);
    res.json({ txHash: tx.hash, eventId, candidateId });
  } catch (err) {
    console.error(err);
    const message = err?.message || 'server error';
    res.status(500).json({ error: message });
  }
});

router.get('/status', async (req, res) => {
  try {
    const { voterId, eventId } = req.query;
    if (!voterId) {
      return res.status(400).json({ error: 'voterId required' });
    }

    if (!eventId || !isValidEventId(eventId)) {
      return res.status(400).json({ error: 'eventId required and must be a valid event.' });
    }

    const voted = await chain.isVoted(voterId, Number(eventId));
    res.json({ voted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
