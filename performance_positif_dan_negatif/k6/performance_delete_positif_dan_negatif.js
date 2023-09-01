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
  //  token otentikasi yang sudah diperoleh
  let authToken = '3a9891d6106c9e6c1edca0adaf241ccbde961b89f4f60e76a53b8659db5018cc';

  let headers = getHeaders(authToken);

  // DELETE request (Positive Test)
  let userId = 4949964; 
  let response = http.del(`https://gorest.co.in/public/v2/users/${userId}`, null, headers);
  check(response, {
    'DELETE status is 204': (res) => res.status === 204,
  });

  // DELETE request (Negative Test)
  let invalidResponse = http.del(`https://gorest.co.in/public/v2/invalid-endpoint`, null, headers);
  check(invalidResponse, {
    'Invalid DELETE status is 404': (res) => res.status === 404,
  });

  sleep(1);
}
export function handleSummary(data) {
  return {
    "report_performance_delete_gorest_positif_dan_negatif.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}