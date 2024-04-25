# Prepare your web service for production

_With examples for Node.js services managed with Docker Compose:_

- Make sure you can start each service in non-watch production mode (`npm run build` followed by `npm run start` instead of `npm run dev`)
- Use environment variables to disable API introspection and debug-level logging (`NODE_ENV=production`)
- If services are containerized, expose them to each other on an internal network, leaving only one gateway exposed to the host (in `docker-compose.prod.yml`, use `expose` for internal services and `ports` only for the gateway)
- Run host-exposed services on a variable port to avoid conflict with other services that may run on the server (if your services are containerized, only the gateway needs a variable port: `GATEWAY_PORT=8000`; it can be set in a `.env` file)
- Run the app in background mode to avoid keeping the shell busy (`docker compose -f docker-compose.prod.yml up --build --detach`)
- Mark services with `restart: always` so that Docker will restart them automatically (after a reboot, for example)
