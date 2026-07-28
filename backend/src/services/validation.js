function isValidColombianVoterId(voterId) {
  return typeof voterId === 'string' && /^[1-9][0-9]{5,9}$/.test(voterId.trim());
}

function isValidEventId(eventId) {
  const parsed = Number(eventId);
  return Number.isInteger(parsed) && parsed > 0;
}

module.exports = {
  isValidColombianVoterId,
  isValidEventId,
};
