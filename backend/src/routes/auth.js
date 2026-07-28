const express = require('express');
const router = express.Router();
const chain = require('../services/chain');
const { isValidColombianVoterId } = require('../services/validation');

router.post('/login', async (req, res) => {
  try {
    const { voterId } = req.body;
    if (!voterId || typeof voterId !== 'string') {
      return res.status(400).json({ error: 'voterId is required' });
    }

    if (!isValidColombianVoterId(voterId)) {
      return res.status(400).json({ error: 'Invalid Colombian voter ID format.' });
    }

    res.json({ id: voterId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
