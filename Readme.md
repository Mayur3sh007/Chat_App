# MERN Stack Project

## Description
This is a full-stack MERN (MongoDB, Express, React, Node.js) application. The project is divided into two main parts:
- **Client**: The frontend built with React.
- **Server**: The backend built with Node.js, Express, and MongoDB.

## Features
- **Frontend**:
    - Built with React.
    - Modern UI/UX features.
- **Backend**:
    - Node.js with Express for server-side logic.
    - MongoDB for the database.
    - Environment variable support via `.env` file.

## Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- MongoDB (running locally or using a cloud provider like MongoDB Atlas)

## Project Structure
```
/client    # React frontend
/server    # Node.js backend
```

## Installation

### Clone the Repository
```bash
git clone https://github.com/Mayur3sh007/Chat_App
cd Chat_App
```

### Install Dependencies
```bash
# Navigate to client folder and install dependencies
cd client
npm install

# Navigate to server folder and install dependencies
cd ../server
npm install
```

## Environment Variables
Create a `.env` file in the `server` directory with the following configuration:

```env
PORT=3000
MONGODB_URI=
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Fill in the values:
- `MONGODB_URI`: MongoDB connection string
- `CORS_ORIGIN`: Allowed origins for CORS
- `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`: Secrets for token generation
- `CLOUDINARY_*`: Credentials for Cloudinary (if applicable)

## Running the Application

### Start Frontend
```bash
cd client
npm run dev
```

### Start Backend
```bash
cd server
npm run dev
```

The frontend is usually hosted at `http://localhost:5173`, and the backend runs at `http://localhost:3000`.

## Contributing
1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Submit a pull request

## Acknowledgments
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)