# The Movie Database Service

This is the backend microservice for The Movie Database.  
The service runs on port <code>8105</code> by default.

## 🌐 Endpoints

### Movie
| Method | Endpoint                        | Description                                     |
| ------ | ------------------------------- | ----------------------------------------------- |
| GET    | /movies/options?name=\<NAME\>     | Get available movie options by name             |
| GET    | /movies/info?id=\<ID\>            | Get detailed information about a movie by ID    |
| GET    | /movies/recommendations?id=\<ID\> | Get movie recommendations based on a movie ID   |

### Series
| Method | Endpoint                        | Description                                     |
| ------ | ------------------------------- | ----------------------------------------------- |
| GET    | /series/options?name=\<NAME\>     | Get available series options by name            |
| GET    | /series/info?id=\<ID\>            | Get detailed information about a series by ID   |
| GET    | /series/recommendations?id=\<ID\> | Get series recommendations based on a series ID |
