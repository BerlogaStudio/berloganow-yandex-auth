import {Button, Col, Form, Image, Row} from 'react-bootstrap';
import React from 'react';
import {CaptchaRequired, CaptchaWrong, YandexMusicApi} from './Api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://now.berloga.dev/yandex';
const BOT_USERNAME = process.env.REACT_APP_BOT_USERNAME || 'berloganowbot';


class AuthForm extends React.Component {
  api = new YandexMusicApi();

  constructor(props) {
    super(props);
    const params = new URLSearchParams(window.location.search);
    this.state = {
      username: '',
      password: '',
      error: null,
      authenticated: false,
      displayName: params.get('display_name'),
      hash: params.get('hash'),
    };
  }

  handleChange = ({target: {name, value}}) => {
    this.setState({...this.state, [name]: value, error: null});
  };

  handleSubmit = event => {
    event.preventDefault();

    this.setState({
      ...this.state,
      x_captcha_url: undefined,
      x_captcha_key: undefined,
    });

    const {username, password, x_captcha_answer, x_captcha_key, hash} = this.state;
    this.api.generate_token_by_username_and_password(username, password, x_captcha_answer, x_captcha_key).then(token => {
      this.api.send_token_to_backend(BACKEND_URL, hash, token).then(() => {
        this.setState({...this.state, authenticated: true});
      }).catch(error => {
        this.setState({...this.state, error});
      });
    }).catch(error => {
      if (error instanceof CaptchaRequired || error instanceof CaptchaWrong) {
        const {x_captcha_url, x_captcha_key, error_description} = error.body;
        this.setState({
          ...this.state,
          x_captcha_url,
          x_captcha_key,
          error: error_description,
        });
      } else {
        this.setState({...this.state, error});
      }
    });
  };

  render() {
    const {Link} = this.props;
    const {x_captcha_url, error, authenticated, displayName, hash} = this.state;

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
      <Form>
        <p className="text-muted text-center">
          <small>Linking Yandex.Music to <b>{displayName}</b></small>
        </p>
        <Form.Group controlId="formBasicEmail">
          <Form.Control name="username" onChange={this.handleChange}
                        type="email" placeholder="Login, email or phone"/>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Control name="password" onChange={this.handleChange}
                        type="password" placeholder="Password"/>
          <Link url="https://passport.yandex.ru/auth/restore/" text="Forgot?"/>
        </Form.Group>

        {x_captcha_url &&
          <Form.Group controlId="formBasicCaptcha">
            <Row className="mb-2">
              <Col><Image fluid src={x_captcha_url}/></Col>
              <Col className="align-self-center">
                <Button className="btn-block" type="submit" onClick={this.handleSubmit}>
                  Refresh
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Control name="x_captcha_answer" onChange={this.handleChange}
                              type="text" placeholder="Enter the captcha code"/>
              </Col>
            </Row>
          </Form.Group>
        }

        {error && <>
          <p className="mt-1 text-danger">{`${error}`}</p>
          <p className="mt-1 text-info">
            <small>
              If your password is correct but sign-in fails (likely 2FA), use one of these alternative apps to
              obtain your token, then paste it manually in the bot:
              <ul className="mt-1">
                <li><a href="https://github.com/MarshalX/yandex-music-token/releases">Android app</a></li>
                <li><a href="https://chromewebstore.google.com/detail/yandex-music-token/lcbjeookjibfhjjopieifgjnhlegmkib">Chrome extension</a></li>
                <li><a href="https://addons.mozilla.org/en-US/firefox/addon/yandex-music-token/">Firefox extension</a></li>
              </ul>
            </small>
          </p>
        </>}

        <Button variant="primary" type="submit" block onClick={this.handleSubmit} className="mb-1">
          Sign in
        </Button>
      </Form>
    );
  }
}

export default AuthForm;
