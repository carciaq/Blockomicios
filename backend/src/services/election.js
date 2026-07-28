const EVENTS = [
  {
    id: 1,
    name: 'Presidencia',
    description: 'Elección nacional para la presidencia de la república.',
  },
  {
    id: 2,
    name: 'Senado',
    description: 'Elección de los representantes al Senado.',
  },
  {
    id: 3,
    name: 'Alcaldía',
    description: 'Elección local para la alcaldía municipal.',
  },
];

const CANDIDATES = [
  { id: 101, eventId: 1, name: 'Alice Perez', party: 'Partido Verde', avatar: 'AP', proposal: 'Transparencia fiscal y energías limpias.' },
  { id: 102, eventId: 1, name: 'Carlos Ruiz', party: 'Movimiento Ciudadano', avatar: 'CR', proposal: 'Reforma educativa y seguridad social.' },
  { id: 103, eventId: 1, name: 'Mariana Soto', party: 'Coalición Progresista', avatar: 'MS', proposal: 'Protección ambiental y derechos digitales.' },
  { id: 201, eventId: 2, name: 'Ricardo Gómez', party: 'Partido Liberal', avatar: 'RG', proposal: 'Empleo juvenil y nueva infraestructura.' },
  { id: 202, eventId: 2, name: 'Laura Jiménez', party: 'Partido Conservador', avatar: 'LJ', proposal: 'Fortalecimiento de la justicia y la familia.' },
  { id: 203, eventId: 2, name: 'Sofía Medina', party: 'Alianza Democrática', avatar: 'SM', proposal: 'Salud pública universal y energía sostenible.' },
  { id: 301, eventId: 3, name: 'Andrés Torres', party: 'Movimiento Local', avatar: 'AT', proposal: 'Movilidad eficiente y barrios seguros.' },
  { id: 302, eventId: 3, name: 'Natalia Rojas', party: 'Ciudadanos Unidos', avatar: 'NR', proposal: 'Impulso al emprendimiento y educación comunitaria.' },
  { id: 303, eventId: 3, name: 'Jorge Castellanos', party: 'Frente Cívico', avatar: 'JC', proposal: 'Mejoramiento de parques y servicios públicos.' },
];

function getEvents() {
  return EVENTS;
}

function getEventById(eventId) {
  return EVENTS.find((event) => event.id === Number(eventId)) || null;
}

function getCandidatesByEvent(eventId) {
  return CANDIDATES.filter((candidate) => candidate.eventId === Number(eventId));
}

function getCandidateById(candidateId) {
  return CANDIDATES.find((candidate) => candidate.id === Number(candidateId)) || null;
}

function groupResultsByEvent(votes) {
  const grouped = EVENTS.map((event) => ({
    eventId: event.id,
    eventName: event.name,
    description: event.description,
    totalVotes: 0,
    candidates: getCandidatesByEvent(event.id).map((candidate) => ({
      candidateId: candidate.id,
      name: candidate.name,
      party: candidate.party,
      votes: 0,
    })),
  }));

  const eventMap = grouped.reduce((acc, item) => {
    acc[item.eventId] = item;
    return acc;
  }, {});

  for (const vote of votes) {
    const summary = eventMap[Number(vote.eventId)];
    if (!summary) continue;
    summary.totalVotes += 1;
    const candidateSummary = summary.candidates.find((c) => c.candidateId === Number(vote.candidateId));
    if (candidateSummary) {
      candidateSummary.votes += 1;
    }
  }

  return grouped;
}

module.exports = {
  EVENTS,
  CANDIDATES,
  getEvents,
  getEventById,
  getCandidatesByEvent,
  getCandidateById,
  groupResultsByEvent,
};
