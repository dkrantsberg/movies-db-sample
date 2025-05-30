# Movies Database API

A REST API for querying a movie database with pagination, filtering, and detailed movie information including ratings.

## Technologies Used

- **NestJS**
- **TypeORM**
- **SQLite**
- **nestjs-paginate**
- **Swagger/OpenAPI**

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Docker

To build and run this API in Docker use the following npm scripts:

```bash
$ npm run docker:build        # Build the Docker image
$ npm run docker:run          # Run container directly
$ npm run docker:compose      # Run with docker-compose
$ npm run docker:compose:prod # Run in production mode (detached)
```

## API Documentation

- **Swagger UI**: http://localhost:3000/api
- **OpenAPI JSON**: http://localhost:3000/api-json

## API Endpoints

- `GET /movies` - List all movies (first page)
- `GET /movies?page=10` - List all movies (paginated)
- `GET /movies/:id` - Get movie details by ID
- `GET /movies/genre/:genre` - Get movies by genre
- `GET /movies/year/:year` - Get movies by release year
- `GET /movies/year/:year?sortBy=releaseDate:DESC` - Get movies by year, sorted by release date in descending order

For detailed API documentation, see the Swagger UI at http://localhost:3000/api 

For detailed documentation on sorting, filtering, and pagination, refer to the [nestjs-paginate](https://github.com/ppetzold/nestjs-paginate) documentation
## Example Usage

```bash
# Get first page of movies
curl "http://localhost:3000/movies"

# Get 10th page of movies (50 movies per page)
curl "http://localhost:3000/movies?page=10"

# Get movie details
curl "http://localhost:3000/movies/2"

# Get comedy movies (first page)
curl "http://localhost:3000/movies/genre/Comedy"

# Get comedy movies (paginated, 50 per page)
curl "http://localhost:3000/movies/genre/Comedy?page=10"

# Get movies from 1988
curl "http://localhost:3000/movies/year/1988"

# Get movies from 1988 ordered by release date descending
curl "http://localhost:3000/movies/year/1988?sortBy=releaseDate:DESC"
```

## Run unit tests

```bash
# unit tests
$ npm run test
```