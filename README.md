# BACKEND

Installation

Clone the Repository:
```bash
git clone https://github.com/Samrat0505/FEED4ME.git
cd FEED4ME
cd backend
```
Install Dependencies:
```bash
npm install
```
Set Up Environment Variables:Create a .env file in the root directory and add the following variables:
```bash
TOKEN_SECRET=your_jwt_secret_key
MONGO_URI=your_mongodb_connection_string
```
Start the Server:
```bash
npm start
```
The server will start on http://localhost:3000.

API Endpoints

1. Register a New Farmer
```
Endpoint: POST /auth/register
```
Request Body:
```bash
{ 
  "name": "mohan", 
  "mobile": "89438383439",
  "password": "admin@123",
  "age":31,
  "location":"roorkee"
}
```
Response:
```bash
{
  "status": "Registration successful",
  "userData": {
    "name": "mohan",
    "age": "31",
    "location": "roorkee",
    "password": "$2a$10$6SnM9j4kDJHvGXzURC9i3.UV.i/7KiytQLIGPKmjCqSwa2pE0hqKK",
    "mobile": "89438383439",
    "date": "2025-01-26T18:31:11.423Z",
    "_id": "6796808eb24826ee6e0305d5",
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiJ9.ODk0MzgzODM0Mzk.sFW7JVsm1Y3T5W2Zl3UsZWh0Dkuu-3Yb2PbTNIcM2rc"
}
```
2. Login a Farmer
```
Endpoint: POST /auth/login
```
Request Body:
```bash
{
  "mobile":"89438383439",
  "password":"admin@123"
}
```
Response:
```bash
{
  "status": "Logged in successfully",
  "data": {
    "_id": "6796808eb24826ee6e0305d5",
    "name": "mohan",
    "age": "31",
    "location": "roorkee",
    "password": "$2a$10$6SnM9j4kDJHvGXzURC9i3.UV.i/7KiytQLIGPKmjCqSwa2pE0hqKK",
    "mobile": "89438383439",
    "date": "2025-01-26T18:31:11.423Z",
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiJ9.ODk0MzgzODM0Mzk.sFW7JVsm1Y3T5W2Zl3UsZWh0Dkuu-3Yb2PbTNIcM2rc"
}
```
