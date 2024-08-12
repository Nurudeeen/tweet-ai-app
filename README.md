
# Autobot Application

This project is a full-stack application built with NestJS for the backend and Vue.js for the frontend. The application is designed to simulate the creation of "Autobots" along with their posts and comments. It also provides a REST API with rate limiting and a WebSocket connection to display real-time updates on the frontend.

## Prerequisites

- **Node.js**: Make sure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **npm**: Node.js includes npm, the Node package manager.
- **Docker** (optional): If you prefer using Docker for database setup.

## Project Structure

- **Backend**: NestJS application located in the `backend` directory.
- **Frontend**: Vue.js application located in the `frontend` directory.

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Nurudeeen/tweet-ai-app.git
cd tweet-ai-app
```

### 2. Setup the Backend

1. Navigate to the backend directory:

   ```bash
   cd tweetai-backend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Configure the environment variables:

   Copy the `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

4. (Optional) If you're using Docker for the database, start the database container:

   ```bash
   docker-compose up -d
   ```

5. Run the backend:

   ```bash
   npm run start:dev
   ```

   This will start the NestJS backend server on `http://localhost:3000`.

### 3. Setup the Frontend

1. Open a new terminal window/tab and navigate to the frontend directory:

   ```bash
   cd ../tweetai-frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run the frontend:

   ```bash
   npm run serve
   ```

   This will start the Vue.js frontend server on `http://localhost:8080`.

### 4. Running Both Frontend and Backend Simultaneously

- **Frontend**: Runs on `http://localhost:8080`
- **Backend**: Runs on `http://localhost:3000`

Make sure both servers are running. You can use two terminal windows/tabs or tools like `concurrently` if you prefer running them in a single terminal.

### 5. Testing the Application

1. Open your browser and navigate to `http://localhost:8080` to see the frontend interface.
2. The WebSocket connection will automatically connect to the backend and display the current Autobot count.
3. The backend's REST API is available at `http://localhost:3000/api`. You can use tools like Postman to interact with the API.

### 6. Using the API

#### API Endpoints

- **GET /api/users**: Fetch Autobots (limited to 10 per request).
- **GET /api/users/:userId/posts**: Fetch posts by a specific Autobot (limited to 10 per request).
- **GET /api/posts/:postId/comments**: Fetch comments for a specific post (limited to 10 per request).

**Note**: The API is rate-limited to 5 requests per minute per IP.

### 7. Stopping the Servers

- **Backend**: Use `Ctrl + C` in the terminal where the backend is running.
- **Frontend**: Use `Ctrl + C` in the terminal where the frontend is running.
- **Docker** (if used): Run `docker-compose down` to stop and remove the Docker containers.

## Troubleshooting

- **Port Conflicts**: If `3000` or `8080` is already in use, you can change the ports in the `.env` file for the backend and `vue.config.js` for the frontend.
- **Database Issues**: Ensure that the database connection details in the `.env` file are correct.
- **Throttling**: The API has a rate limit of 5 requests per minute. Ensure your requests do not exceed this limit.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
