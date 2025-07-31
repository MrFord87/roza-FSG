export async function fetchSAMData({ keyword, naics, state, postedFrom, postedTo }) {
  const params = new URLSearchParams({
    api_key: API_KEY,
    q: keyword || '',
    limit: 10,
    sort: 'modifiedDate',
  });

  if (naics) params.append('naics', naics);
  if (state) params.append('place_of_performance_state_code', state);
  if (postedFrom) params.append('postedFrom', postedFrom);
  if (postedTo) params.append('postedTo', postedTo);

  const url = `https://api.sam.gov/opportunities/v1/search?${params.toString()}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching SAM.gov data:', error.response?.data || error.message);
    return null;
  }
}
