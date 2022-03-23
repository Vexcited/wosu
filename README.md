# osu-web-player

> A web osu! beatmap player with multiplayer.

## Development

### Getting Started

**Yarn** is recommended instead of NPM.

```bash
# Install dependencies.
yarn

# Start development server.
yarn dev

# Build the app with API.
yarn build

# Start the builded app.
yarn serve 
```

### API

API handler is an Express app used with Vite using `vite-plugin-mix`.
It is only used to handle multiplayer matchs' states.

#### `/api/matchs`