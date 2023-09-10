# Voting Secured in Chains

Voting Secured in Chains is a project that implements a secure and transparent voting system using blockchain technology. This README.md file provides an overview of the project, its features, and instructions on how to set it up and use it.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Voting Secured in Chains is a secure and tamper-proof online voting system that leverages blockchain technology to ensure the integrity of the election process. This system allows users to create elections, add positions and candidates, cast votes, and check election results in a transparent and secure manner.

## Features

- **Election Management**: Users can create and manage elections, specifying the election name and start date.

- **Position and Candidate Management**: Positions can be added to elections, and candidates can be associated with these positions. Candidates are identified by their name and email.

- **User Authentication**: Users are authenticated based on their email addresses to prevent unauthorized access.

- **Vote Casting**: Authenticated users can cast their votes for candidates in different positions within an election. Duplicate votes are prevented.

- **Result Verification**: Election results are transparently displayed, showing the number of votes each candidate received in each position.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- A relational database (e.g., PostgreSQL) set up and running.
- Prisma CLI installed globally (`npm install -g prisma`).

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/thexovc/voting-secured-in-chains-api.git
   cd voting-secured-in-chains
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Configure your database connection by updating the `.env` file with your database URL:

   ```dotenv
   DATABASE_URL="your_database_url_here"
   ```

4. Run database migrations to create the schema:

   ```bash
   npx prisma migrate dev
   ```

5. Start the application:

   ```bash
   npm start
   ```

The application should now be running on `http://localhost:3000`.

## Usage

1. Create an election by making a POST request to `/api/elections` with the election name and start date in the request body.

2. Add positions to the election using a POST request to `/api/positions`. Include the position title and the election ID.

3. Add candidates to positions using a POST request to `/api/candidates`. Provide the candidate's name, email, and the position ID.

4. Users can vote by making a POST request to `/api/votes`. Include the user ID, position ID, election ID, and candidate ID in the request body. This endpoint prevents duplicate votes.

5. Check election results by making a GET request to `/api/elections/:id/results`, where `:id` is the election ID.

## API Endpoints

- `POST /api/elections`: Create a new election.
- `POST /api/positions`: Add a position to an election.
- `POST /api/candidates`: Add a candidate to a position.
- `POST /api/votes`: Cast a vote in an election.
- `GET /api/elections`: Get all elections.
- `GET /api/positions/:id`: Get all positions in an election.
- `GET /api/candidates/:id`: Get all candidates in a position.
- `GET /api/elections/:id/results`: Check election results.

## Contributing

Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md) when making contributions to this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
