import React, { Component } from 'react';
import * as OktaSignIn from '@okta/okta-signin-widget';
import logo from '../../shared/img/logo/okta-logo.png';
import './okta.scss';

export default class OktaLogin extends Component {
  constructor(props) {
    super(props);
    this.signIn = new OktaSignIn({
      /**
       * Note: when using the Sign-In Widget for an OIDC flow, it still
       * needs to be configured with the base URL for your Okta Org. Here
       * we derive it from the given issuer for convenience.
       */
      baseUrl: props.issuer.split('/oauth2')[0],
      clientId: props.clientId,
      redirectUri: props.redirectUri,
      logo: logo,
      i18n: {
        en: {
          'primaryauth.title': 'Sign in to IAM',
        },
      },
      authParams: {
        responseType: ['id_token', 'token'],
        issuer: props.issuer,
        display: 'page',
      },
    });
  }
  componentDidMount() {
    this.signIn.renderEl(
      { el: '#sign-in-widget' },
      () => {
        /**
         * In this flow, the success handler will not be called beacuse we redirect
         * to the Okta org for the authentication workflow.
         */
      },
      (err) => {
      },
    );
  }
  render() {
    console.log(this);
    return (
      <div>
        <div id="sign-in-widget" />
      </div>
    );
  }
}

