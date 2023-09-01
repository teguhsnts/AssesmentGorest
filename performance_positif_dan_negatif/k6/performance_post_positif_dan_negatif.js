import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export let options = {
  
  stages: [
    { duration: '0.1m', target: 1 },
    { duration: '0.1m', target: 1 },
    { duration: '0.1m', target: 1 },
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],
    'http_req_failed': ['rate<0.1'],
  },
};

// Fungsi untuk membuat header dengan token otentikasi
export function getHeaders(authToken) {
  return {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  };
}

export default function () {
  // token otentikasi yang sudah diperoleh
  let authToken = '3a9891d6106c9e6c1edca0adaf241ccbde961b89f4f60e76a53b8659db5018cc';

  let headers = getHeaders(authToken);

  // POST request (Positive Test)
  let payloadPost = {
    name: 'Jaws Jr',
    email: 'jawsjr123@example.com',
    gender: 'male',
    status: 'active',
  };
  headers.headers['Content-Type'] = 'application/json';
  
  let response = http.post('https://gorest.co.in/public/v2/users', JSON.stringify(payloadPost), headers);
  check(response, {
    'POST status is 201': (res) => res.status === 201,
  });

  // POST request (Negative Test)
  let invalidPayload = {
    invalid_key: 'Invalid Data',
  };
  let invalidResponse = http.post('https://gorest.co.in/public/v2/users', JSON.stringify(invalidPayload), headers);
  check(invalidResponse, {
    'Invalid POST status is 422': (res) => res.status === 422,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "report_performance_post_gorest_positif_dan_negatif.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}