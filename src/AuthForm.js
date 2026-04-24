import {Alert, Button, Form} from 'react-bootstrap';
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
      this.setState({error: "We couldn't find an access_token in that input. Paste the full URL from Yandex's page, or just the token."});
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
        <div className="text-center">
          <p><b>Invalid link.</b></p>
          <p>Open @{BOT_USERNAME} in Telegram, send <code>/start</code> and press "Authorize Yandex.Music" again.</p>
          <a href={`https://t.me/${BOT_USERNAME}`}>
            <Button variant="primary" block>Open @{BOT_USERNAME}</Button>
          </a>
        </div>
      );
    }

    if (authenticated) {
      return (
        <div className="text-center">
          <p className="text-success"><b>✅ Linked!</b></p>
          <a href={`tg://resolve?domain=${BOT_USERNAME}`}>
            <Button variant="primary" block>Return to Telegram</Button>
          </a>
          <small className="text-muted">
            If the button doesn't work — <a href={`https://t.me/${BOT_USERNAME}`}>open @{BOT_USERNAME}</a>.
          </small>
        </div>
      );
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <p className="text-muted text-center">
          <small>Linking Yandex.Music to <b>{displayName}</b></small>
        </p>

        <Alert variant="light" style={{border: '1px solid #e6e6ea'}}>
          <p className="mb-2"><b>Step 1.</b> Sign in to Yandex in a new tab — this is Yandex's own login page, it handles 2FA and everything:</p>
          <a href={AUTHORIZE_URL} target="_blank" rel="noreferrer">
            <Button variant="primary" block>Sign in with Yandex →</Button>
          </a>
        </Alert>

        <Alert variant="light" style={{border: '1px solid #e6e6ea'}}>
          <p className="mb-2"><b>Step 2.</b> After you sign in, Yandex will redirect you to a page whose URL looks like:</p>
          <p className="mb-2"><code style={{wordBreak: 'break-all', fontSize: '12px'}}>https://oauth.yandex.ru/verification_code#access_token=<b>y0_AgAAAAA...</b>&token_type=bearer&expires_in=...</code></p>
          <p className="mb-0"><b>Copy the entire URL</b> (⌘L, ⌘A, ⌘C on macOS · Ctrl+L, Ctrl+A, Ctrl+C on Windows/Linux) and paste it below. We'll extract the token automatically.</p>
        </Alert>

        <Form.Group controlId="formPasted">
          <Form.Label><b>Step 3.</b> Paste the URL (or just the token)</Form.Label>
          <Form.Control as="textarea" rows={3} value={pasted}
                        onChange={this.handleChange}
                        placeholder="https://oauth.yandex.ru/verification_code#access_token=..."/>
        </Form.Group>

        {error && <p className="text-danger"><small>{error}</small></p>}

        <Button variant="success" type="submit" block disabled={submitting || !pasted}>
          {submitting ? 'Linking…' : 'Link Yandex.Music'}
        </Button>
      </Form>
    );
  }
}

export default AuthForm;
