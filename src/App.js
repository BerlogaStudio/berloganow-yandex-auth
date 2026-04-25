import React, {Component} from 'react';
import AuthForm from './AuthForm';

const BOT_USERNAME = process.env.REACT_APP_BOT_USERNAME || 'berloganowbot';

class App extends Component {
  render() {
    return (
      <div className="wrap">
        <div className="tag">Authorize Yandex.Music</div>
        <h1>Connect Yandex.Music</h1>
        <p className="lede">
          You sign in on Yandex's own login page (2FA and everything) and the access token
          is sent to our backend over HTTPS. Your password never touches our server — it
          never even touches this page.
        </p>

        <AuthForm/>

        <footer>
          Source: <a href="https://github.com/BerlogaStudio/berloganow-yandex-auth"
                    target="_blank" rel="noreferrer">berloganow-yandex-auth</a>
          {' · '}
          Powered by <a href="https://github.com/MarshalX/yandex-music-api"
                       target="_blank" rel="noreferrer">yandex-music-api</a> by{' '}
          <a href="https://github.com/MarshalX/" target="_blank" rel="noreferrer">@MarshalX</a>
          {' · '}
          <a href={`https://t.me/${BOT_USERNAME}`} target="_blank" rel="noreferrer">@{BOT_USERNAME}</a>
        </footer>
      </div>
    );
  }
}

export default App;
