import apiClient from '../services/apiClient';

const votingRepository = {
  async getEvents() {
    const { data } = await apiClient.get('/events');
    return data;
  },

  async getCandidates(eventId) {
    const { data } = await apiClient.get('/candidates', { params: { eventId } });
    return data;
  },

  async castVote(voterId, eventId, candidateId, encryptedData) {
    const { data } = await apiClient.post('/vote', { voterId, eventId, candidateId, encryptedData });
    return data;
  },

  async getVoteStatus(voterId, eventId) {
    const { data } = await apiClient.get('/vote/status', { params: { voterId, eventId } });
    return data;
  },

  async getResults() {
    const { data } = await apiClient.get('/results');
    return data;
  },
};

export default votingRepository;
