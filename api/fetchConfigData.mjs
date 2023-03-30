import axios from 'axios';

async function fetchConfigData(apiEndpoint) {
  const response = await axios.get(apiEndpoint);
  const { data } = response;
  return data;
}

export default fetchConfigData;
