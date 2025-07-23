// services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.sam.gov', // Replace this baseURL for each source (we’ll handle per-endpoint if needed)
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    api_key: 'jOZCfNRzt6nwN7jb5oWRSC5qFw9nz67QV0Rclc3x',
  },
});

export default api;
