const express = require('express');
const router = express.Router();

const CANDIDATES = [
  { id: 1, name: 'Alice Perez', party: 'Partido Verde' },
  { id: 2, name: 'Carlos Ruiz', party: 'Movimiento Ciudadano' },
  { id: 3, name: 'Mariana Soto', party: 'Coalición Progresista' },
];

router.get('/', (req, res) => {
  res.json(CANDIDATES);
});

module.exports = router;
