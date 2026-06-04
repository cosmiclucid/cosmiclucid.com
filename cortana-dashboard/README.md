# COSMIC CORTANA Dashboard

Private Next.js dashboard for `cosmiccortana.louislucid.com`.

## Local Development

```bash
cd cortana-dashboard
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000` and log in with `CORTANA_DASHBOARD_PASSWORD`.

## Build

```bash
npm run build
npm run start
```

## Environment

Required:

```bash
CORTANA_DASHBOARD_PASSWORD=replace-with-a-long-private-password
NEXT_PUBLIC_TELEGRAM_BOT_URL=https://t.me/your_bot
NEXT_PUBLIC_N8N_URL=https://n8n.louislucid.com
```

Reserved for future server-side Hermes integration:

```bash
HERMES_API_URL=http://127.0.0.1:8001/chat
HERMES_API_TOKEN=
HERMES_BRIDGE_PORT=8001
HERMES_COMMAND_PATH=hermes
```

`HERMES_API_TOKEN` is optional for the local-only bridge, but if you add bridge auth later it must remain server-only. Never expose Hermes settings in client components or `NEXT_PUBLIC_*` variables.

## Architecture Notes

- App Router pages live in `app/`.
- Password protection is enforced by `middleware.ts`.
- Login uses a server action and stores a signed HTTP-only cookie.
- Browser chat posts only to the protected Next.js route `app/api/chat/route.ts`.
- The Next.js route calls the server-only Hermes adapter in `lib/hermes.ts`.
- `lib/hermes.ts` calls the local Hermes bridge at `http://127.0.0.1:8001/chat`.
- The bridge in `server/hermes-bridge` runs `hermes -z "<message>"` through `execFile`.
- There are no unauthenticated public API routes that trigger Hermes, and the bridge must not be exposed through Nginx.

## Hermes Bridge

Install the local-only bridge on the VPS:

```bash
cd cortana-dashboard/server/hermes-bridge
npm install
HERMES_BRIDGE_PORT=8001 HERMES_COMMAND_PATH=hermes npm start
```

If `hermes` is not available on the service PATH, set an absolute path:

```bash
HERMES_COMMAND_PATH=/usr/local/bin/hermes
```

The bridge binds only to:

```txt
127.0.0.1:8001
```

The full runtime path is:

```txt
Frontend Chat UI
-> Next.js /api/chat
-> http://127.0.0.1:8001/chat
-> hermes -z "<message>"
-> JSON reply
```

Bridge details and service examples live in `server/hermes-bridge/README.md`.

## PWA

The app includes:

- `public/manifest.webmanifest`
- `public/sw.js`
- installable app metadata in `app/layout.tsx`

The service worker only registers in production.

## VPS Deployment

Example deployment flow on Ubuntu:

```bash
cd /var/www
git clone <your-repo-url> cosmiclucid.com
cd cosmiclucid.com/cortana-dashboard
npm ci
cp .env.example .env.local
nano .env.local
npm run build
```

Run the app with PM2:

```bash
npm install -g pm2
pm2 start npm --name cosmic-cortana -- start -- -p 3010
cd server/hermes-bridge
HERMES_BRIDGE_PORT=8001 HERMES_COMMAND_PATH=hermes pm2 start index.js --name hermes-bridge
pm2 save
pm2 startup
```

Systemd examples:

- Dashboard: run `npm start -- -p 3010` from `/var/www/cosmiclucid.com/cortana-dashboard`
- Hermes bridge: use the unit example in `server/hermes-bridge/README.md`

## Nginx Reverse Proxy

Create `/etc/nginx/sites-available/cosmiccortana.louislucid.com`:

```nginx
server {
    server_name cosmiccortana.louislucid.com;

    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:

```bash
sudo ln -s /etc/nginx/sites-available/cosmiccortana.louislucid.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d cosmiccortana.louislucid.com
```

Do not add an Nginx location for `127.0.0.1:8001`. Only the dashboard should be public:

```txt
Internet -> Nginx -> Next.js dashboard :3010 -> Hermes bridge :8001 -> Hermes runtime
```
