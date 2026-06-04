# Hermes Bridge

Local-only Node/Express bridge from the COSMIC CORTANA dashboard to the Hermes CLI/runtime.

The bridge must run on the same VPS as Hermes and bind only to `127.0.0.1`.

## Install

```bash
cd cortana-dashboard/server/hermes-bridge
npm install
```

## Environment

```bash
HERMES_BRIDGE_PORT=8001
HERMES_COMMAND_PATH=hermes
```

If `hermes` is not on the service PATH, use the absolute binary path:

```bash
HERMES_COMMAND_PATH=/usr/local/bin/hermes
```

## Run

```bash
npm start
```

The service listens at:

```txt
http://127.0.0.1:8001
```

## Endpoint

```http
POST /chat
Content-Type: application/json

{
  "message": "Hello Cortana"
}
```

Response:

```json
{
  "reply": "Hello Louis."
}
```

## PM2

```bash
cd /var/www/cosmiclucid.com/cortana-dashboard/server/hermes-bridge
HERMES_BRIDGE_PORT=8001 HERMES_COMMAND_PATH=hermes pm2 start index.js --name hermes-bridge
pm2 save
pm2 startup
```

## systemd

Create `/etc/systemd/system/hermes-bridge.service`:

```ini
[Unit]
Description=COSMIC CORTANA Hermes Bridge
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/cosmiclucid.com/cortana-dashboard/server/hermes-bridge
Environment=HERMES_BRIDGE_PORT=8001
Environment=HERMES_COMMAND_PATH=hermes
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=5
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

Enable:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now hermes-bridge
sudo systemctl status hermes-bridge
```

## Nginx

Do not proxy this bridge through Nginx.

Public traffic should only reach the Next.js dashboard:

```txt
Internet
-> Nginx cosmiccortana.louislucid.com
-> Next.js dashboard on 127.0.0.1:3010
-> Hermes bridge on 127.0.0.1:8001
-> Hermes CLI/runtime
```

Keep `127.0.0.1:8001` private to the VPS.
