# elysian-realm

✨ My opinionated boilerplate for curating a new project with Elysia. 

This boilerplate stack is designed to be a starting point for new projects that use Elysia, with PostgreSQL as the database and Docker for containerization. It includes a basic project structure, configuration files, and a more opinionated setup for development.

## Features

Below are the key stack features included in this boilerplate:

- **[T3 Env](https://env.t3.gg)**: Framework agnostic validation for type-safe environment variables.
- **[Drizzle](https://orm.drizzle.team)**: TypeScript ORM that offers type integrity out of the box.
- **[Elysia](https://elysiajs.com)**: TypeScript framework supercharged by Bun with End-to-End Type Safety, unified type system, and outstanding developer experience
- **[Biome](https://biomejs.dev)**: Toolchain for web projects, aimed to provide functionalities to maintain them. Biome offers formatter and linter, usable via CLI and LSP.

Additional features includes:

- Basic User and Authentication with JWT module.
- Docker environment for running the project in a containerized environment.
- Pre-configured initial [Bruno](https://www.usebruno.com/) collection for the API endpoints.

## Initial Setup

This setup guide assumes that you have already installed [Bun](https://bun.sh/) on your local machine.

1. Clone the repository to your local machine.

```bash
# HTTPS
git clone https://github.com/yehezkieldio/elysia-boilerplate

# SSH
git clone git@github.com:yehezkieldio/elysia-boilerplate.git
```

2. Install the dependencies.

```bash
bun install
```

3. Start the development server.

```bash
bun dev
```

## Code Quality

This boilerplate uses [Biome](https://biomejs.dev/) to enforce code quality and consistency. You can run the following commands to lint and format your code.

```bash
# Check for linting errors
bun lint:check

# Apply linting fixes
bun lint

# Apply unsafe linting fixes
bun lint:unsafe
```

```bash
# Check for formatting errors
bun format:check

# Format the code
bun format
```

```bash
# Install lefthook for lint and format commit hooks
bun lefthook:install
```

## Docker Environment

This boilerplate includes a Docker environment for running the project in a containerized environment. You can use the following commands to manage the Docker environment.

```bash
# Build and run the production compose file
bun prod:up

# Stop the production compose file
bun prod:down
```

```bash
# Build and run the development compose file
bun dev:up

# Stop the development compose file
bun dev:down
```

```bash
# Start the dedicated PostgreSQL compose file
bun db:up

# Stop the dedicated PostgreSQL compose file
bun db:down
```

## License

This repository is licensed under the MIT License.
See the [LICENSE](LICENSE.md) file for more information.
