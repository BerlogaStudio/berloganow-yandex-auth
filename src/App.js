import React, {Component} from 'react';
import {CardDeck, Col, Container, Row} from 'react-bootstrap';
import AuthForm from './AuthForm';
import TrustCard from './TrustCard';

const BOT_USERNAME = process.env.REACT_APP_BOT_USERNAME || 'berloganowbot';

class Link extends Component {
  render() {
    const {children, text} = this.props;
    const content = text || children;
    return <a href={this.props.url} target="_blank" rel="noreferrer">{content}</a>;
  }
}

class App extends Component {
  render() {
    return (
      <Container>
        <Row className="mt-5">
          <Col className="d-none d-xl-block col-md-4"/>
          <Col>
            <Row className="d-flex justify-content-center mb-2">
              <h3>@{BOT_USERNAME} · Yandex.Music</h3>
            </Row>
            <Row className="d-flex justify-content-center px-5 text-center mb-3">
              <p className="text-muted">
                <small>Your password is sent straight to Yandex OAuth from your browser.
                Our server only ever sees the resulting access token.</small>
              </p>
            </Row>
            <AuthForm Link={Link}/>
          </Col>
          <Col className="d-none d-xl-block col-md-4"/>
        </Row>

        <Row className="mt-5">
          <Container className="justify-content-center">
            <h2 className="text-center mb-3">Why you can trust this page</h2>
            <Row>
              <CardDeck className="mx-0">
                <TrustCard icon={['fab', 'yandex']} title="Direct to Yandex"
                           text="Your credentials are sent straight to oauth.yandex.com — never to the bot's backend."/>
                <TrustCard icon={['fab', 'expeditedssl']} title="HTTPS only"
                           text="All traffic is encrypted end-to-end."/>
                <TrustCard icon="key" title="No passwords stored"
                           text="The bot's server only receives the access token you just generated."/>
                <TrustCard icon="code" title="Open source"
                           text="Inspect the full source on GitHub before you type anything."/>
              </CardDeck>
            </Row>
          </Container>
        </Row>

        <hr/>
        <Row className="mb-3">
          <Container>
            <Row className="d-flex justify-content-between">
              <Col xs={{span: 'auto'}}>
                <small>
                  Source: <Link text="berloganow-yandex-auth" url="https://github.com/BerlogaStudio/berloganow-yandex-auth"/>
                </small>
              </Col>
              <Col xs={{span: 'auto'}} className="text-right">
                <small>
                  Based on <Link text="yandex-music-token" url="https://github.com/MarshalX/yandex-music-token"/> by <Link text="@MarshalX" url="https://github.com/MarshalX/"/>
                </small>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
    );
  }
}

export default App;
