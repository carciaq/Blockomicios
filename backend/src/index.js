const express = require('express');
const cors = require('cors');
const chain = require('./services/chain');
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/vote');
const candidatesRoutes = require('./routes/candidates');
const resultsRoutes = require('./routes/results');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/vote', voteRoutes);
app.use('/candidates', candidatesRoutes);
app.use('/results', resultsRoutes);

app.get('/', (req, res) => res.json({ ok: true, deployed: !!chain.contractAddress }));

const PORT = process.env.PORT || 4000;
chain
  .initChain()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to initialize chain:', err);
    process.exit(1);
  });
