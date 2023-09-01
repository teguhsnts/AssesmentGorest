# AssesmentGorest
# Performance Testing with K6

This repository contains a performance testing script written in K6 to test the API endpoints of https://gorest.co.in.

## Prerequisites

Before running the script, make sure you have the following installed:

- [K6](https://k6.io/docs/getting-started/installation/)
- Node.js for HTML report generation (https://nodejs.org/en)

## Usage

1. Clone this repository:

   ```bash
   git clone https://github.com/teguhsnts/AssesmentGorest.git

   1. Install the required Node.js packages for report generation:
      npm install
   2. edit config.js and change token with your own token number
      export const TOKEN = 'your_api_token_here';
   3. Run the K6 script:
      k6 run script.js

Script Details
The K6 script performs the following operations:

GET request to retrieve user data (Positive Test)
GET request to an invalid endpoint (Negative Test)
POST request to create a new user (Positive Test)
POST request with invalid payload (Negative Test)
PUT request to update a user (Positive Test)
PUT request to an invalid endpoint (Negative Test)
DELETE request to delete a user (Positive Test)
DELETE request to an invalid endpoint (Negative Test)
Viewing Reports
After running the script, you can view the HTML report by opening the report_performance_test_gorest.html file generated in the project directory.


   
