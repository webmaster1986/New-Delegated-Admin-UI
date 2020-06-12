export default {
  oidc: {
    clientId: localStorage.getItem('clientId') || '0oam0nrbdxDfPW4C80h7',
    issuer: localStorage.getItem('issuer') || 'https://psegnjb2c.oktapreview.com/oauth2/default',
    redirectUri: localStorage.getItem('redirectUri') || 'http://localhost:8080/implicit/callback',
  },
};
