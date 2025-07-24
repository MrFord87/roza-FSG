import axios from 'axios';

export async function fetchSAMData() {
  try {
    const response = await axios.get('https://api.sam.gov/prototypes/contracts', {
      headers: {
        'Authorization': 'Bearer jOZCfNRzt6nwN7jb5oWRSC5qFw9nz67QV0Rclc3x'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching SAM.gov data:', error);
    return null;
  }
}
