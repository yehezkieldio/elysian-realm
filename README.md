# elysia-boilerplate

✨ Standard boilerplate for curating a new project with Elysia.

This boilerplate stack is designed to be a starting point for new projects that use Elysia. It includes a basic project structure, configuration files, and a more opinionated setup for development.

Features:

- A Docker setup for development.
- This boilerplate uses [Bun](https://bun.sh/) as the primary runtime.
- With [Biome](https://biomejs.dev/) as an alternative to ESLint and Prettier combo. Biome is a performant toolchain that includes a fast formatter, linter, etc.

## Getting Started

### Local Setup

- Clone the repository
```bash
git clone <url>
```

- Install dependencies and start the development server

```bash
bun install
bun dev
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

## License

This repository is licensed under the MIT License.
See the [LICENSE](LICENSE.md) file for more information.