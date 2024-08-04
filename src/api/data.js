import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_BASE_URL;
export default axios.create({
  baseURL: apiUrl,
  headers: {
    'Accept': 'application/json',
  },
});

// to run json server: npx json-server -p 3500 -w data/db.json