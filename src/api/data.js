import axios from 'axios';

export default axios.create({
  baseURL: 'http://192.168.29.88:3500', // use 'http://localhost:3500/' to make webosocket function properly on a mobile device connected to a localhost server
  headers: {
    //'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// to run json server: npx json-server -p 3500 -w data/db.json