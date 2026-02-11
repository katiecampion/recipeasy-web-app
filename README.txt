README.txt

HOW TO INSTALL AND RUN THE APPLICATION

REQUIRED SOFTWARE (INSTALL FIRST)

- Node.js (version 18 or higher)
  (npm is included with Node.js)
- MySQL Server
- MySQL Workbench (or another MySQL client)
- A modern web browser (Chrome, Firefox, or Edge)

REQUIRED NODE PACKAGES

This application uses Node.js with Express and additional middleware.
All required packages are listed in package.json and installed automatically
using npm, including:

- express
- express-session
- bcrypt
- mysql2
- dotenv
- express-rate-limit

No packages need to be installed manually other than running npm install.

INSTALLATION

1. Extract the project ZIP folder.
2. Open a terminal in the project root directory.
3. Run:
   npm install

DATABASE SETUP

1. Start MySQL Server.
2. Run the provided SQL file to create and populate the database:
   recipeasy_db.sql

ENVIRONMENT CONFIGURATION

The .env file is not included in the submission.

Create a file named .env in the project root directory and add the following
environment variables:

DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=recipeasy_db
SESSION_SECRET=your_session_secret
API_KEY=your_api_key


RUNNING THE APPLICATION

1. Start the server:
   node app/server.js

2. Open a browser and go to:
   http://localhost:3000

