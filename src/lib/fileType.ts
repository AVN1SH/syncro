import axios from 'axios';

export async function getContentType(url: string): Promise<string> {
  try {
    const response = await axios.head(url);
    return response.headers['content-type'];
  } catch (error) {
    console.error('Error fetching content type:', error);
    return 'unknown';
  }
}