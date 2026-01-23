# Puzzio

Minimal Next.js (App Router) + TypeScript + Tailwind starter scaffold created by the workspace generator.

Getting started

1. Install dependencies

```bash
# macOS (zsh)
cd "$(dirname \"$0\")" || exit
npm install
```

2. Run dev server

```bash
npm run dev
```

Open http://localhost:3000

## Enable Claude Sonnet 3.5 for all clients

This repository contains a placeholder note for the request "Enable Claude Sonnet 3.5 for all clients". Enabling a specific model (Claude Sonnet 3.5) for all clients typically requires administrative configuration in the service provider's management console or API (not something that can be fully enacted from a local project scaffold).

Placeholders / next steps:

- If you have a management console or API, add the steps or scripts here to toggle the model for all clients.
- If you want, tell me how you manage clients (self-hosted server, third-party API, admin dashboard) and I can add an automated script or guidance.

## Local development (npm)

This project now uses a standard local Node/npm workflow. To run locally you need Node.js and npm installed on your machine (recommended: Node 18+).

## Node version management

This project includes a `.nvmrc` file pinned to Node 18. If vous utilisez [nvm](https://github.com/nvm-sh/nvm), vous pouvez garantir la bonne version avec :

```bash
nvm install
nvm use
```

Cela active automatiquement Node 18 pour ce projet.

1. Install dependencies

```bash
# from the repository root
npm install
```

2. Run the development server

```bash
npm run dev
# or using the Makefile
make dev
```

3. Build for production

```bash
npm run build
# or
make build
```

4. Start the production server

```bash
npm start
# or
make start
```

Other useful commands (via Makefile):

```bash
make install   # npm install
make lint      # npm run lint
make test      # npm test
make clean     # rm -rf node_modules .next
```

## Environment variables

Copy `.env.example` to `.env` and edit values as needed. The `.env` file is not committed to the repository.

## Notes

- If you want, I can add an `.nvmrc` to pin the Node version or a GitHub Actions workflow to run tests and lint on PRs.
- If you later change your mind and want Docker again, I can re-add the Docker setup.
# Build cache buster
