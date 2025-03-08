Project Overview
=================

You have been asked to build a secure and scalable RESTful API that allows users to create, read, update, and delete notes. 
The application should also allow users to share their notes with other users and search for notes based on keywords.


## Technical Requirements

Implement a RESTful API using a framework of your choice (e.g. Express, DRF, Spring).
Use a database of your choice to store the data (preferably MongoDB or PostgreSQL).
Use any authentication protocol and implement a simple rate limiting and request throttling to handle high traffic.
Implement search functionality to enable users to search for notes based on keywords. ( preferably text indexing for high performance )
Write unit tests and integration tests your API endpoints using a testing framework of your choice.


## API Endpoints

Your API should implement the following endpoints:

### Authentication Endpoints

- POST /api/auth/signup: create a new user account.
- POST /api/auth/login: log in to an existing user account and receive an access token.


### Note Endpoints

- GET /api/notes: get a list of all notes for the authenticated user.
- GET /api/notes/ get a note by ID for the authenticated user.
- POST /api/notes: create a new note for the authenticated user.
- PUT /api/notes/ update an existing note by ID for the authenticated user.
- DELETE /api/notes/ delete a note by ID for the authenticated user.
- POST /api/notes/:id/share: share a note with another user for the authenticated user.
- GET /api/search?q=:query: search for notes based on keywords for the authenticated user.