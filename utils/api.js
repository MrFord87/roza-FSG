import axios from 'axios';

const API_KEY = 'YOUR_REAL_API_KEY_HERE'; // Replace with your actual API key

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
