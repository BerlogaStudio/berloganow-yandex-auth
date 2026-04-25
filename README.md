# berloganow-yandex-auth

One-page React SPA that links a Yandex.Music account to the [`@berloganowbot`](https://t.me/berloganowbot) Telegram bot.

## How it works

1. The bot sends the user a link like `https://yandex.now.berloga.dev/?display_name=@user&hash=<state>`.
2. The user clicks **Sign in with Yandex** — opens `oauth.yandex.ru/authorize` with the official Yandex.Music public `client_id`. They sign in with 2FA, password manager, whatever.
3. After pressing **Allow**, Yandex redirects them to `https://music.yandex.ru/#access_token=...&token_type=bearer&...`. The user copies the URL (or just the token) and pastes it back into this page.
4. The SPA `POST`s `{hash, token}` to the bot's backend at `https://now.berloga.dev/yandex`. The backend verifies the token against `yandex-music-api`, looks up the Telegram user by `hash`, and stores it.
5. The page shows a "Return to Telegram" button.

The user's password never touches our server — and never even touches this page.

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

The bot's backend talks to Yandex.Music via [`yandex-music-api`](https://github.com/MarshalX/yandex-music-api) by [@MarshalX](https://github.com/MarshalX) — the actual heavy lifting. This SPA exists only to translate the implicit OAuth token-flow into a tidy redirect for the bot.
