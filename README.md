# elysia-boilerplate

✨ Standard boilerplate for curating a new project with Elysia.

This boilerplate stack is designed to be a starting point for new projects that use Elysia. It includes a basic project structure, configuration files, and a more opinionated setup for development.

## Features

- A Docker setup for development.
- This boilerplate uses [Bun](https://bun.sh/) as the primary runtime.
- With [Biome](https://biomejs.dev/) as an alternative to ESLint and Prettier combo. Biome is a performant toolchain that includes a fast formatter, linter, etc.

## Getting Started

### Local Setup

- Clone the repository
```bash
# HTTPS
git clone https://github.com/yehezkieldio/elysia-boilerplate.git

# SSH
git clone git@github.com:yehezkieldio/elysia-boilerplate.git
```

- Install dependencies and start the development server

```bash
bun install
bun dev
```

- Run code linting and formatting if needed
```bash
bun lint
bun lint:unsafe # Apply unsafe fixes
bun lint:check # Check for lint errors
bun format
bun format:check # Check for formatting errors
```

### Docker Setup

- Start the production setup
```bash
docker-compose --file docker/docker-compose.yml up -d

# Run with rebuild images
docker-compose --file docker/docker-compose.yml up -d --build
```

- Start the development setup
```bash
docker-compose --file docker/dev/docker-compose.yml up -d

# Run with rebuild images
docker-compose --file docker/dev/docker-compose.yml up -d --build
```

- Start a dedicated PostgreSQL container
```bash
docker-compose --file docker/db/docker-compose.yml up -d
```

## License

This repository is licensed under the MIT License.
See the [LICENSE](LICENSE.md) file for more information.