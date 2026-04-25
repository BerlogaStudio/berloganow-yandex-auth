import React from 'react';
import {YandexMusicApi} from './Api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://now.berloga.dev/yandex';
const BOT_USERNAME = process.env.REACT_APP_BOT_USERNAME || 'berloganowbot';

// Official Yandex.Music client — same client_id the mobile/desktop apps use.
// Music API scopes aren't available to third-party OAuth clients, so we're
// stuck with this public client_id. The redirect flow works with 2FA; the
// password grant does not.
const YANDEX_CLIENT_ID = '23cabbbdc6cd418abb4b39c32c41195d';
const AUTHORIZE_URL = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${YANDEX_CLIENT_ID}&force_confirm=no`;


function extractToken(pasted) {
  const s = (pasted || '').trim();
  if (!s) return null;
  // If the user pasted the whole URL with #access_token=... or ?access_token=...
  const m = s.match(/access_token=([A-Za-z0-9_\-.]+)/);
  if (m) return m[1];
  // Otherwise assume they pasted just the bare token (must look reasonable)
  if (/^[A-Za-z0-9_\-.]{20,}$/.test(s)) return s;
  return null;
}


class AuthForm extends React.Component {
  api = new YandexMusicApi();

  constructor(props) {
    super(props);
    const params = new URLSearchParams(window.location.search);
    this.state = {
      pasted: '',
      error: null,
      submitting: false,
      authenticated: false,
      displayName: params.get('display_name'),
      hash: params.get('hash'),
    };
  }

  handleChange = ({target: {value}}) => {
    this.setState({pasted: value, error: null});
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const token = extractToken(this.state.pasted);
    if (!token) {
      this.setState({error: "We couldn't find an access_token in that input. Paste the full URL from the redirect page, or just the token."});
      return;
    }
    this.setState({submitting: true, error: null});
    try {
      await this.api.send_token_to_backend(BACKEND_URL, this.state.hash, token);
      this.setState({authenticated: true});
    } catch (err) {
      this.setState({error: err.message || String(err), submitting: false});
    }
  };

  render() {
    const {error, authenticated, displayName, hash, pasted, submitting} = this.state;

    if (!displayName || !hash) {
      return (
        <div className="card center">
          <p><b>Invalid link.</b></p>
          <p className="muted">Open @{BOT_USERNAME} in Telegram, send <code>/start</code> and press "Authorize Yandex.Music" again.</p>
          <a className="cta" href={`https://t.me/${BOT_USERNAME}`}>Open @{BOT_USERNAME}</a>
        </div>
      );
    }

    if (authenticated) {
      return (
        <div className="card center">
          <div className="badge">✅</div>
          <p className="ok"><b>Linked!</b></p>
          <a className="cta" href={`tg://resolve?domain=${BOT_USERNAME}`}>Return to Telegram</a>
          <p className="muted small">
            If the button doesn't work — <a href={`https://t.me/${BOT_USERNAME}`}>open @{BOT_USERNAME}</a>.
          </p>
        </div>
      );
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <p className="muted center small">Linking Yandex.Music to <b>{displayName}</b></p>

        <ol className="steps">
          <li>
            <h3>Sign in on Yandex</h3>
            <p>Open the official Yandex login page in a new tab. It handles 2FA, password managers — everything Yandex normally does.</p>
            <p><a className="cta" href={AUTHORIZE_URL} target="_blank" rel="noreferrer">Sign in with Yandex →</a></p>
          </li>
          <li>
            <h3>Copy the redirect URL</h3>
            <p>After you press <b>Allow</b>, Yandex redirects you to a page on <code>music.yandex.ru</code>. The address bar will look like:</p>
            <p><code className="url">https://music.yandex.ru/#access_token=<b>y0_AgAAAAA...</b>&token_type=bearer&expires_in=...&cid=...</code></p>
            <p className="note">Yes, the page itself is just music.yandex.ru — that's normal. The token lives in the URL fragment after <code>access_token=</code>.</p>
            <p><b>Copy the entire URL</b> — ⌘L → ⌘A → ⌘C on macOS, Ctrl+L → Ctrl+A → Ctrl+C on Windows/Linux. We'll extract the token automatically.</p>
          </li>
          <li>
            <h3>Paste it below</h3>
            <textarea rows={3} value={pasted} onChange={this.handleChange}
                      placeholder="https://music.yandex.ru/#access_token=..."/>
            {error && <p className="err small">{error}</p>}
            <button type="submit" className="cta primary" disabled={submitting || !pasted}>
              {submitting ? 'Linking…' : 'Link Yandex.Music'}
            </button>
          </li>
        </ol>
      </form>
    );
  }
}

export default AuthForm;
