const express = require('express');
const router = express.Router();
const chain = require('../services/chain');

router.post('/', async (req, res) => {
  try {
    const { voterId, candidateId, encryptedData } = req.body;
    if (!voterId || typeof candidateId !== 'number' || !encryptedData) {
      return res.status(400).json({ error: 'voterId, candidateId and encryptedData are required' });
    }

    const tx = await chain.castVote(voterId, candidateId, encryptedData);
    res.json({ txHash: tx.hash, candidateId });
  } catch (err) {
    console.error(err);
    const message = err?.message || 'server error';
    res.status(500).json({ error: message });
  }
});

router.get('/status', async (req, res) => {
  try {
    const { voterId } = req.query;
    if (!voterId) {
      return res.status(400).json({ error: 'voterId required' });
    }

    const voted = await chain.isVoted(voterId);
    res.json({ voted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
