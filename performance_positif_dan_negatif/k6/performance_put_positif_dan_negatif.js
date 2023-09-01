import http from 'k6/http';
import { sleep, check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";


export let options = {
  
  stages: [
    { duration: '0.2m', target: 10 },
    { duration: '0.4m', target: 7},
    { duration: '0.3m', target: 0 },
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

  // PUT request (Positive Test)
  let userId = 4949207; 
  let payload = JSON.stringify({
    name: 'Dzakii',
  });
  headers.headers['Content-Type'] = 'application/json';
  
  let response = http.put(`https://gorest.co.in/public/v2/users/${userId}`, payload, headers);
  check(response, {
    'PUT status is 200': (res) => res.status === 200,
  });

  // PUT request (Negative Test)
  let invalidPayload = {
    invalid_key: 'Invalid Data',
  };
  let invalidResponse = http.put(`https://gorest.co.in/public/v2/users/${userId}`, JSON.stringify(invalidPayload), headers);
  check(invalidResponse, {
    'Invalid PUT status is 422': (res) => res.status === 422,
  });

  sleep(1);
}

export function handleSummary(data) {
  return {
    "report_performance_put_gorest_positif_dan_negatif.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}