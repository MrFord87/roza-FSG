import axios from 'axios';

const API_KEY = 'jOZCfNRzt6nwN7jb5oWRSC5qFw9nz67QV0Rclc3x'; // ← Replace with your actual key

export async function fetchSAMData(keyword) {
  const url = `https://api.sam.gov/opportunities/v1/search?api_key=${API_KEY}&keyword=${encodeURIComponent(keyword)}&limit=10&sort=modifiedDate`;

  try {
    const response = await axios.get(url);
    console.log('API RAW JSON:', response.data); // For debugging
    return response.data;
  } catch (error) {
    console.error('Error fetching SAM.gov data:', error.response?.data || error.message);
    return null;
  }
}
