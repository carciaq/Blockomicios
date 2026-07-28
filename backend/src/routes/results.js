const express = require('express');
const router = express.Router();
const chain = require('../services/chain');
const { groupResultsByEvent } = require('../services/election');

router.get('/', async (req, res) => {
  try {
    const votes = await chain.getResults();
    const groupedResults = groupResultsByEvent(votes);
    res.json({ results: groupedResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
