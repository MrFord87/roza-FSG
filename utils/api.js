import axios from 'axios';

const API_KEY = 'GAPIibFeKRJPKpjkhxUlCRU1fjkynbAQ2tfyMVEj';

export async function fetchSAMData(keyword) {
  const url = `https://api.sam.gov/opportunities/v1/search?api_key=${API_KEY}&q=${encodeURIComponent(keyword)}&limit=10&sort=modifiedDate`;

  try {
    const response = await axios.get(url);
    console.log('API FULL RESPONSE:',data);
    return response.data;
  } catch (error) {
    console.error('Error fetching SAM.gov data:', error.response?.data || error.message);
    return null;
  }
}
