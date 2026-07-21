import apiClient from '../services/apiClient';

const votingRepository = {
  async getCandidates() {
    const { data } = await apiClient.get('/candidates');
    return data;
  },

  async castVote(voterId, candidateId, encryptedData) {
    const { data } = await apiClient.post('/vote', { voterId, candidateId, encryptedData });
    return data;
  },

  async getResults() {
    const { data } = await apiClient.get('/results');
    return data;
  },
};

export default votingRepository;
