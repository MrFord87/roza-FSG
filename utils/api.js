import axios from 'axios';

const API_KEY = 'GAPIibFeKRJPKpjkhxUlCRU1fjkynbAQ2tfyMVEj';

export async function fetchSAMData(keyword) {
  const url = `https://api.openopps.us/api/rest/opportunities/search?apikey=${API_KEY}&q=${encodeURIComponent(keyword)}&limit=10`;

  try {
    const response = await axios.get(url);
    console.log('✅ API RAW JSON:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching Open Opportunities data:', error.response?.data || error.message);
    return null;
  }
}
