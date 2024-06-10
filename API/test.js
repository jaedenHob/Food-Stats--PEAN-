// file to run API tests when having the webser running locally
// When node server is hosted postman will be used for testing instead

require('dotenv').config(); // Load environment variables from .env file

const http = require('http');
const assert  = require("assert");

let BASE_URL = "http://localhost:5000";

// do to each helper function being asyncronous they
// must be wrapped in a promise

// helper function to make a get request
const getRequest = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, (response) => {
            let data = '';
            // concanate data chunks
            response.on('data', (chunk) => {
                data += chunk;
            });
            // resolve promise when data recieved
            response.on('end', () => {
                // object with status code and data
                resolve({
                    statusCode: response.statusCode,
                    body: data
                });
            });
        }).on('error', (error) => {
            // reject when there is an error
            reject(error);
        });
    });
};

// Helper function to make POST requests
const makePostRequest = (path, data) => {
    return new Promise((resolve, reject) => {
        const dataString = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(dataString)
            }
        };

        const req = http.request(options, (res) => {
            let responseString = '';

            res.on('data', (chunk) => {
                responseString += chunk;
            });

            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: responseString
                });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(dataString);
        req.end();
    });
};

// Helper function to make DELETE requests
const makeDeleteRequest = (path) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'DELETE',
        };

        const req = http.request(options, (res) => {
            let responseString = '';

            res.on('data', (chunk) => {
                responseString += chunk;
            });

            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: responseString
                });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.end();
    });
};
 
/** 
 * To test that the connection between webserver and database works
*/

// make sure variables from .env are available and correct
console.log("Database .env variables")
console.log('DB_USER:' + ' ' + process.env.DB_USER);
console.log('DB_HOST:' + ' ' + process.env.DB_HOST);
console.log('DB_NAME:' + ' ' + process.env.DB_NAME);
console.log('DB_PASSWORD:' + ' ' + process.env.DB_PASSWORD);
console.log('DB_PORT:' + ' ' + process.env.DB_PORT);
console.log('JWT_SECRET:' + ' ' + process.env.JWT_SECRET);
console.log("");

const pool = require('./config/db'); // Adjust the path if necessary

(async () => {
    try {
        // Test the connection by querying the current timestamp
        const result = await pool.query('SELECT * FROM users');
        console.log('Database connection successful:', result.rows[0]);
    } catch (error) {
        console.error('Database connection error:', error);
    } finally {
        // End the pool to free up resources
        pool.end();
    }
})();


const testServer = async () => {
    try {
        const response = await getRequest(BASE_URL + '/api/');
        console.log("");
        console.log("Testing get request to server \nresponse: " + response.body);
        console.log("");
        assert(response.statusCode === 200);
    } catch (error) {
        console.error("Error testing server: ", error);
    }
};

// test user
const registerData = {
        username: 'testuser',
        email: 'testUser@example.com',
        password: 'password123',
        dateofbirth: '2000-01-01',
        gender: 'M',
        heightininches: 70,
        weightinpounds: 150.5,
        goalweight: 140.0
};

// Function to test creating a new user
const testCreateUser = async () => {

    try {
        const response = await makePostRequest(BASE_URL + '/api/register', registerData);
        console.log('Register response:', response.body);
        assert(response.statusCode === 201, 'Expected response status code to be 201');
        const registerResponseData = JSON.parse(response.body);
        assert(registerResponseData.email === registerData.email, 'Expected email to match');
        return registerResponseData;
    } catch (error) {
        console.error("Error creating user: ", error);
    }
};

// Function to test logging in a user
const testLoginUser = async (registerData) => {
    const loginData = {
        email: registerData.email,
        password: registerData.password,
    };

    try {
        const response = await makePostRequest(BASE_URL + '/api/login', loginData);
        console.log('Login response:', response.body);
        assert(response.statusCode === 200, 'Expected response status code to be 200');
        const loginResponseData = JSON.parse(response.body);
        assert(loginResponseData.token, 'Expected a JWT response');
    } catch (error) {
        console.error("Error logging in user: ", error);
    }
};

// Function to test deleting a user
const testDeleteUser = async (userId) => {
    try {
        const response = await makeDeleteRequest(BASE_URL + '/api/delete/user/' + userId);
        console.log('Delete response:', response.body);
        assert(response.statusCode === 200, 'Expected response status code to be 200');
        const deleteResponseData = JSON.parse(response.body);
        assert(deleteResponseData.message === 'User has been successfully deleted', 'Expected successful delete message');
    } catch (error) {
        console.error("Error deleting user: ", error);
    }
};


// run all of the test
(async () => {
    await testServer();
    const registerResponseData = await testCreateUser();
    await testLoginUser(registerData);
    await testDeleteUser(registerResponseData.userid);
})();
