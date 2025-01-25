# Chatbot Application

This project is a chatbot application that allows users to register, log in, and chat with a bot. The bot's responses are generated using the OpenAI API.

## Features

- User registration
- User login
- Chat interface
- Chatbot responses using OpenAI API
- Storing chat transcripts in the database

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Pratyush-404/Chatbot-DB.git
   cd Chatbot-DB
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   DB_USER=your_database_user
   DB_HOST=your_database_host
   DB_NAME=your_database_name
   DB_PASSWORD=your_database_password
   DB_PORT=your_database_port
   SSL_CERT_PATH=path_to_your_ssl_certificate
   SESSION_SECRET=your_session_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Set up the database:
   - Ensure you have PostgreSQL installed and running.
   - Create a new database and run the SQL script in `config/schema.sql` to create the necessary tables.

5. Start the server:
   ```bash
   npm start
   ```

6. Open your browser and navigate to `http://localhost:3000` to access the application.

## Usage

### Registration

1. Open the application in your browser.
2. Fill in the registration form with a username and password.
3. Click the "Register" button.
4. If the registration is successful, you will see an alert message.

### Login

1. Open the application in your browser.
2. Fill in the login form with your username and password.
3. Click the "Login" button.
4. If the login is successful, the chat interface will be displayed.

### Chatting with the Bot

1. After logging in, you will see the chat interface.
2. Type your message in the input field and click the "Send" button.
3. The bot's response will be displayed in the chat box.

## Additional Information

To get all the features from the [Duplex repository](https://github.com/OutstandingWork/Duplex) along with the database and user registration features implemented in this codebase, follow these steps:

1. Clone the Duplex repository:
   ```bash
   git clone https://github.com/OutstandingWork/Duplex.git
   cd Duplex
   ```

2. Integrate the database and user registration features from this codebase into the Duplex repository:
   - Copy the `config/schema.sql` file to the Duplex repository and run the SQL script to create the necessary tables.
   - Copy the `DBConnection.cjs` file to the Duplex repository and update the database connection settings.
   - Copy the registration and login logic from `server.cjs` to the appropriate server file in the Duplex repository.
   - Copy the registration and login forms from `client/index.html` to the appropriate client file in the Duplex repository.
   - Copy the chat interface and chatbot logic from `client/app.js` to the appropriate client file in the Duplex repository.

3. Update the Duplex repository to use the OpenAI API for chatbot responses:
   - Follow the instructions in the Duplex repository to set up the OpenAI API.

4. Test the integrated application to ensure all features are working correctly.

