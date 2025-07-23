import axios from 'axios';

const SAM_API_KEY = 'jOZCfNRzt6nwN7jb5oWRSC5qFw9nz67QV0Rclc3x'; // Replace with secure env storage later

export const fetchSAMData = async (searchTerm = '') => {
  try {
    const response = await axios.get(`https://api.sam.gov/prod/opportunities/v1/search`, {
      params: {
        api_key: SAM_API_KEY,
        q: searchTerm,
        limit: 5,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching SAM.gov data:', error);
    return null;
  }
};
