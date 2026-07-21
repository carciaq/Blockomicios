const express = require('express');
const router = express.Router();
const chain = require('../services/chain');

router.post('/login', async (req, res) => {
  try {
    const { voterId } = req.body;
    if (!voterId || typeof voterId !== 'string') {
      return res.status(400).json({ error: 'voterId is required' });
    }

    const voted = await chain.isVoted(voterId);
    res.json({ id: voterId, voted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
