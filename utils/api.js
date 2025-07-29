import axios from 'axios';

const API_KEY = 'jOZCfNRzt6nwN7jb5oWRSC5qFw9nz67QV0Rclc3x';

export async function fetchSAMData(keyword) {
  const url = `https://api.sam.gov/opportunities/v1/search?api_key=${API_KEY}&q=${encodeURIComponent(keyword)}&limit=10&sort=modifiedDate`;

  try {
    const response = await axios.get(url);
    console.log('API RAW JSON:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching SAM.gov data:', error.response?.data || error.message);
    return null;
  }
}
