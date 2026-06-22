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

Hermes WebUI integration:

```bash
HERMES_WEBUI_BASE_URL=http://127.0.0.1:8787
NEXT_PUBLIC_HERMES_WEBUI_URL=/hermes/
```

Keep Hermes WebUI bound to `127.0.0.1`. `HERMES_WEBUI_BASE_URL` is server-only. `NEXT_PUBLIC_HERMES_WEBUI_URL` is only the browser-facing path used by the “Open full Hermes” button.

If the upstream WebUI is password protected, the dashboard adapter can forward a server-only credential:

```bash
HERMES_WEBUI_AUTH_HEADER=
HERMES_WEBUI_COOKIE=
```

Do not place credentials in `NEXT_PUBLIC_*` variables.

## Architecture Notes

- App Router pages live in `app/`.
- Password protection is enforced by `middleware.ts`.
- Login uses a server action and stores a signed HTTP-only cookie.
- Browser chat posts only to the protected Next.js route `app/api/chat/route.ts`.
- The Next.js route calls the server-only Hermes adapter in `lib/hermes.ts`.
- `lib/hermes-agent.ts` adapts the native Hermes WebUI API at `http://127.0.0.1:8787`.
- Hermes WebUI remains the source of truth for sessions, memory, models, profiles, tools, approvals, workspace state, and cron jobs.
- Cosmic Cortana owns the dashboard, specialist-agent views, mission control, and protected proxy routes.
- There are no unauthenticated public API routes that trigger Hermes.

## Hermes WebUI

Install the supplied Hermes WebUI beside the existing Hermes Agent installation:

```bash
git clone https://github.com/nesquena/hermes-webui.git
cd hermes-webui
python3 bootstrap.py
```

For a background VPS service:

```bash
./ctl.sh start
./ctl.sh status
./ctl.sh logs --lines 100
```

Hermes WebUI should bind only to:

```txt
127.0.0.1:8787
```

The full runtime path is:

```txt
Cosmic Cortana
-> protected Next.js /api/hermes/* routes
-> Hermes WebUI :8787
-> existing Hermes Agent, sessions, memory, tools, models, and cron runtime
```

Cosmic Cortana uses Hermes WebUI’s synchronous chat endpoint for its compact embedded panel. The full Hermes WebUI remains available at `/hermes/` for streaming chat, file browsing, tool approvals, profile management, and advanced session controls.

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
pm2 save
pm2 startup
```

Run Hermes WebUI separately with its included `ctl.sh` or a systemd unit. The dashboard process should not own or restart the Hermes runtime.

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

    location /hermes/ {
        proxy_pass http://127.0.0.1:8787/;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_read_timeout 3600;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
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

The intended topology is:

```txt
Internet -> Nginx -> Cosmic Cortana :3010
                  -> Hermes WebUI :8787 at /hermes/

Cosmic Cortana server -> Hermes WebUI :8787 -> Hermes Agent
```

Hermes WebUI sends `X-Frame-Options: DENY`, so Cosmic Cortana opens the full workspace as a separate page rather than embedding it in an iframe.
