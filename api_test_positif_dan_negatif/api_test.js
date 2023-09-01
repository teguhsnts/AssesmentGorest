require('dotenv').config(); // Load environment variables from .env file

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const { default: axios } = require('axios');

chai.use(chaiHttp);

const baseUrl = "https://gorest.co.in"
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

describe('Automation API Testing', () => {
    let userId;


    //POST Create New User
    it('Create a new user', async function() {
        const createUser = {
            name: 'Teguh Santoso',
            email: 'teguhsnts@gmail.com',
            gender: 'male',
            status: 'active'
        };
    
        const response = await axios.post(`${baseUrl}/public/v2/users`, createUser, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });
    
        expect(response.status).to.equal(201);
        userId = response.data.id;
        console.log(response.data);
    })
    it('should handle invalid user data - Negative Test', async () => {
        const invalidUser = {
          name: '',
          email: 'invalid_email',
          gender: 'invalid_gender',
          status: 'invalid_status'
        };
    
        try {
          await axios.post(`${baseUrl}/public/v2/users`, invalidUser, {
            headers: { Authorization: `Bearer ${ACCESS_TOKEN}` }
          });
        } catch (error) {
          expect(error.response.status).to.equal(422);
        }
    });

    //GET User Details
    it('Get user details', async function() {

        const response = await axios.get(`${baseUrl}/public/v2/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });
    
        console.log(response.data);
        expect(response.status).to.equal(200);
        expect(response.data.id).to.equal(userId);
        expect(response.data.name).to.equal('Teguh Santoso');
        expect(response.data.email).to.equal('teguhsnts@gmail.com');
        expect(response.data.gender).to.equal('male');
        expect(response.data.status).to.equal('active');
    })
    it('should handle invalid token - Negative Test', async () => {
        const invalidToken = 'invalid_token_here';
    
        try {
          await axios.get(baseUrl, {
            headers: { Authorization: `Bearer ${invalidToken}` }
          });
        } catch (error) {
          expect(error.response.status).to.equal(401);
        //   console.log(error.response.data)
        }
      });
      

    //PUT Update User
    it('Update user', async function() {
        const UpdateUser = {
            name: 'teguhsnts',
            email: 'teguhs@gmail.com',
            gender: 'male',
            status: 'active'  
        };
    
        const response = await axios.put(`${baseUrl}/public/v2/users/${userId}`, UpdateUser, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });
    
        console.log(response.data);
        expect(response.status).to.equal(200);
        expect(response.data.id).to.equal(userId);
        expect(response.data.name).to.equal('teguhsnts');
        expect(response.data.email).to.equal('teguhs@gmail.com');
        expect(response.data.gender).to.equal('male');
        expect(response.data.status).to.equal('active'); 
    })
    
    it('should not update a user with invalid token - Negative Test', async () => {
        const updatedName = 'Updated Name';
    
        try {
          await axios.put(`${baseUrl}/public/v2/users/${userId}`, { name: updatedName }, {
            headers: {
              Authorization: `Bearer invalid_token`,
            },
          });
        } catch (error) {
          expect(error.response.status).to.equal(401);
        }
      });
    
    //Delete User
    it('Delete user', async function() {

        const response = await axios.delete(`${baseUrl}/public/v2/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`
            }
        });
    
        expect(response.status).to.equal(204);
    })
});

it('should not delete a user with non-existent ID - Negative Test', async () => {
    try {
      await axios.delete(`${baseUrl}/public/v2/users/non_existent_id`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
    } catch (error) {
      expect(error.response.status).to.equal(404);
    }
  });