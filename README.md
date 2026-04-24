# berloganow-yandex-auth

One-page React SPA that links a Yandex.Music account to the [`@berloganowbot`](https://t.me/berloganowbot) Telegram bot.

Forked from [MarshalX/yandex-music-token](https://github.com/MarshalX/yandex-music-token). The integration pattern (backend URL with `hash` + `display_name` params) is inspired by [anna-oake/nowplaybot-yandex-auth](https://github.com/anna-oake/nowplaybot-yandex-auth).

## How it works

1. The bot sends the user a link like `https://yandex.now.berloga.dev/?display_name=@user&hash=<state>`.
2. The page reads `display_name` and `hash` from the query string and asks the user to sign in with their Yandex credentials.
3. `POST` goes **straight from the browser to `https://oauth.yandex.com/token`** — the Yandex.Music OAuth endpoint, using the public client_id/secret of the official Yandex.Music client. The bot's server never sees the password.
4. On success, the resulting `access_token` is `POST`ed (with the `hash`) to the bot's backend at `https://now.berloga.dev/yandex`, which looks up the Telegram user by `hash` and stores the token.
5. The page shows a "Return to Telegram" button.

## Local dev

```bash
yarn install
yarn start
```

Runs on `http://localhost:3000`. Override the backend URL and bot username via `.env.local`:

```
REACT_APP_BACKEND_URL=http://localhost:8080/yandex
REACT_APP_BOT_USERNAME=berloganowbot
```

## Deployment (Dokploy)

The included `Dockerfile` multi-stage builds the React app and serves it via nginx:80. Push to `master` → GHA builds `ghcr.io/berlogastudio/berloganow-yandex-auth:latest` → pings Dokploy webhook.

Dokploy service setup:

- **App type**: Docker Compose
- **Repo**: `BerlogaStudio/berloganow-yandex-auth`
- **Domain**: `yandex.now.berloga.dev` → container port 80 → HTTPS via Let's Encrypt
- **Env vars** (only if you want to override the defaults baked at build time): `REACT_APP_BOT_USERNAME`, `REACT_APP_BACKEND_URL`

## Credits

- [MarshalX/yandex-music-token](https://github.com/MarshalX/yandex-music-token) — original React page and OAuth client credentials.
- [anna-oake/nowplaybot-yandex-auth](https://github.com/anna-oake/nowplaybot-yandex-auth) — backend-POST integration pattern.
