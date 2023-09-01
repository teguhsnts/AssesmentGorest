import http from 'k6/http';
import { sleep, check } from 'k6';
import { TOKEN } from './config.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

// export let options = {
//   stages: [
//     { duration: '0.2m', target: 20 },
//     { duration: '0.3m', target: 30 },
//     { duration: '0.1m', target: 5 },
//   ],
//   thresholds: {
//     http_req_duration: ['p(95)<500'],
//     http_req_failed: ['rate<0.1'],
//   },
// };

export default function () {
  let authToken = TOKEN;

  if (!authToken) {
    console.error("Token otentikasi tidak ditemukan!");
    return;
  }

  let headers = {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  };

  // GET request (Positive Test)
  let getUsersResponse = http.get('https://gorest.co.in/public/v2/users', headers);
  check(getUsersResponse, {
    'GET status is 200': (res) => res.status === 200,
  });

  // GET request (Negative Test)
  let invalidGetResponse = http.get('https://gorest.co.in/public/v2/invalid-endpoint', headers);
  check(invalidGetResponse, {
    'Invalid GET status is 404': (res) => res.status === 404,
  });

  // POST request (Positive Test)
  let payloadPost = {
    name: 'Dhanisha',
    email: 'dhanisha@example.com',
    gender: 'female',
    status: 'active',
  };
  headers.headers['Content-Type'] = 'application/json';

  let postResponse = http.post('https://gorest.co.in/public/v2/users', JSON.stringify(payloadPost), headers);
  // console.log('POST Response:', postResponse.body);
  check(postResponse, {
    'POST status is 201': (res) => res.status === 201,
  });

  let userId = JSON.parse(postResponse.body).data.id; // Mengambil ID dari respons POST

  // POST request (Negative Test)
  let invalidPayload = {
    invalid_key: 'Invalid Data',
  };
  let invalidPostResponse = http.post('https://gorest.co.in/public/v2/users', JSON.stringify(invalidPayload), headers);
  check(invalidPostResponse, {
    'Invalid POST status is 422': (res) => res.status === 422,
  });

  // PUT request (Positive Test)
  let payloadPut = {
    name: 'Updated Name',
  };
  let putResponse = http.put(`https://gorest.co.in/public/v2/users/${userId}`, JSON.stringify(payloadPut), headers);
  check(putResponse, {
    'PUT status is 200': (res) => res.status === 200,
  });

  // PUT request (Negative Test)
  let invalidPutResponse = http.put('https://gorest.co.in/public/v2/invalid-endpoint', JSON.stringify(payloadPut), headers);
  check(invalidPutResponse, {
    'Invalid PUT status is 404': (res) => res.status === 404,
  });

  // DELETE request (Positive Test)
  let deleteUserResponse = http.del(`https://gorest.co.in/public/v2/users/${userId}`, null, headers);
  check(deleteUserResponse, {
    'DELETE status is 204': (res) => res.status === 204,
  });

  // DELETE request (Negative Test)
  let invalidDeleteResponse = http.del(`https://gorest.co.in/public/v2/invalid-endpoint`, null, headers);
  check(invalidDeleteResponse, {
    'Invalid DELETE status is 404': (res) => res.status === 404,
  });

  sleep(1);
}

export function handleSummary(data) {
    return {
      "report_performance_test_gorest.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }