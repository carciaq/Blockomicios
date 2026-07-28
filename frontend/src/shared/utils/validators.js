export function isValidColombianVoterId(voterId) {
  return typeof voterId === 'string' && /^[1-9][0-9]{5,9}$/.test(voterId.trim());
}
