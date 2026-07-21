const express = require('express');
const router = express.Router();
const chain = require('../services/chain');

router.get('/', async (req, res) => {
  try {
    const votes = await chain.getResults();
    res.json({ votes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
