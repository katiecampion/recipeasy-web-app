# Recipeasy

Recipeasy is a full-stack web application that allows users to search, save, and manage recipes, organise pantry ingredients, and generate shopping lists.

The application integrates user authentication, session management, and external API-based recipe search, with data stored in a MySQL relational database.

This project was developed as part of a Web Development & Deployment module and focuses on clean backend architecture and secure practices.



## Features

- User registration and login (secure password hashing with bcrypt)
- Session management with express-session
- Recipe search via external API
- Save and manage favourite recipes
- Pantry management system
- Shopping list generation
- Rate limiting for improved security
- Structured MVC backend architecture


## Architecture

The backend follows an MVC-inspired structure:

- `controllers/` – Application logic
- `models/` – Database interaction
- `routes/` – Express route definitions
- `middleware/` – Authentication and validation
- `config/` – Database configuration
- `view/` – Frontend templates and client-side scripts

Environment variables are managed securely using `dotenv`.


## Tech Stack

**Backend**
- Node.js
- Express.js
- MySQL
- bcrypt
- express-session
- dotenv
- express-rate-limit

**Frontend**
- HTML
- CSS
- JavaScript



## Security Considerations

- Passwords hashed using bcrypt
- Sessions secured with express-session
- Rate limiting applied to prevent abuse
- Environment variables stored in `.env` (not committed to version control)


## What I Learned

- Structuring a scalable Express application
- Implementing secure authentication flows
- Managing relational database models
- Integrating third-party APIs
- Separating concerns using MVC principles
