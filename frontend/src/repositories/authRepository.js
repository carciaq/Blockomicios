import apiClient from '../services/apiClient';

const authRepository = {
  async login(voterId) {
    const { data } = await apiClient.post('/auth/login', { voterId });
    return {
      id: data.id,
      voted: data.voted,
    };
  },

  async logout() {
    sessionStorage.removeItem('blockvote_session_token');
    return true;
  },
};

export default authRepository;
