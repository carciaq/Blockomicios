const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const voteRoutes = require('./vote');
const candidatesRoutes = require('./candidates');
const resultsRoutes = require('./results');

router.use('/auth', authRoutes);
router.use('/vote', voteRoutes);
router.use('/candidates', candidatesRoutes);
router.use('/results', resultsRoutes);

module.exports = router;
