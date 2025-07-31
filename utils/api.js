import axios from 'axios';

const API_KEY = 'GAPIibFeKRJPKpjkhxUlCRU1fjkynbAQ2tfyMVEj';

export async function fetchSAMData({ keyword = '', naics = '', state = '', postedFrom = '', postedTo = '' }) {
  const url = `https://api.sam.gov/opportunities/v1/search?api_key=${API_KEY}&q=${encodeURIComponent(keyword)}&limit=10&sort=modifiedDate`;
  const params = new URLSearchParams();

  if (keyword) params.append('q', keyword);
  if (naics) params.append('naics', naics);
  if (state) params.append('place_of_performance_state', state);
  if (postedFrom) params.append('postedFrom', postedFrom);
  if (postedTo) params.append('postedTo', postedTo);
  params.append('api_key', API_KEY);
  params.append('limit', 10);
  params.append('sort', 'modifiedDate');

  try {
    const response = await axios.get(`https://api.sam.gov/opportunities/v1/search?${params.toString()}`);
    console.log('API FULL RESPONSE:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching SAM.gov data:', error.response?.data || error.message);
    return null;
  }
}


✅ Done! The utils/api.js file is now updated with the full query support: keyword, NAICS code, state, and posted date range. It also logs the full API response for better debugging. Ready to test in Roza!

