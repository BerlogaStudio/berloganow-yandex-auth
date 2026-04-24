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
                <small>You sign in on Yandex's own login page (2FA and everything) and paste
                the resulting access token back here. Your password never touches our server —
                it never even touches this page.</small>
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
                <TrustCard icon={['fab', 'yandex']} title="Yandex-hosted login"
                           text="You sign in on oauth.yandex.ru — Yandex's own page, 2FA and all. This page never asks for your password."/>
                <TrustCard icon={['fab', 'expeditedssl']} title="HTTPS only"
                           text="All traffic is encrypted end-to-end."/>
                <TrustCard icon="key" title="Token only"
                           text="Our server only ever receives the OAuth access token — nothing more."/>
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
