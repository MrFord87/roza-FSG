import axios from 'axios';

const API_KEY = 'GAPIibFeKRJPKpjkhxUlCRU1fjkynbAQ2tfyMVEj'; // Your SAM.gov API Key

export async function fetchSAMData(keyword, location, naics) {
  const baseUrl = 'https://api.sam.gov/opportunities/v2/search';
  const params = new URLSearchParams();

  params.append('api_key', API_KEY);
  if (keyword) params.append('q', keyword);
  if (location) params.append('placeOfPerformance.stateCode', location);
  if (naics) params.append('naics', naics);
  params.append('sort', 'modifiedDate');
  params.append('limit', '10');

  const url = `${baseUrl}?${params.toString()}`;
  
  // 👇 Add this line to log the actual request URL
  console.log('🔍 FULL REQUEST URL:', url);

  try {
    const response = await axios.get(url);
    console.log('✅ API FULL RESPONSE:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching SAM.gov data:', error.response?.data || error.message);
    return null;
  }
}
