import React, { PureComponent } from 'react';
import EyeIcon from 'mdi-react/EyeIcon';
import KeyVariantIcon from 'mdi-react/KeyVariantIcon';
import AccountOutlineIcon from 'mdi-react/AccountOutlineIcon';
import {ApiService} from "../../../services/ApiService";
import PropTypes from 'prop-types';
import {Button} from "reactstrap";
import {message, Spin} from "antd";
import Cookies from 'universal-cookie';

class LogInForm extends PureComponent {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      showPassword: false,
      name: '',
      password: '',
      isLoading: false
    };
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  showPassword = (e) => {
    e.preventDefault();
    this.setState(({ showPassword: !this.state.showPassword }));
  };

  onLogin = async () => {
    this.setState({
      isLoading: true
    });
    const currentClientId = this.props.match.params.clientId;
    const {name, password} = this.state;
    const payload = {
      requestToken:{
      registeredAppName: currentClientId,
      userid: name,
      password: password
    }
    };
    const data = await ApiService.localLogin(payload)
    if(!data || data.error){
      this.setState({
        isLoading: false
      });
      return message.error('Invalid Credentials')
    } else {
      const accessToken = data && data.tokenResponse && data.tokenResponse.accessToken;
      const cookies = new Cookies();
      cookies.set('JWT_ACCESSTOKEN', accessToken, { path: '/' });
      cookies.set('REGISTERED_APPNAME', currentClientId, { path: '/' });
      cookies.set('LOGGEDIN_USERID', name, { path: '/' });
      this.setState({
        isLoading: false
      });
      window.location.href = `/iga/${currentClientId}/`;
    }
  }

  render() {
    const { showPassword, name, password, isLoading } = this.state;
    return (
      <div className="form">
        <div className="form__form-group">
          <span className="form__form-group-label">Username</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <AccountOutlineIcon />
            </div>
            <input
              name="name"
              value={name}
              type="text"
              onChange={this.onChange}
              placeholder="Name"
            />
          </div>
        </div>
        <div className="form__form-group">
          <span className="form__form-group-label">Password</span>
          <div className="form__form-group-field">
            <div className="form__form-group-icon">
              <KeyVariantIcon />
            </div>
            <input
              name="password"
              onChange={this.onChange}
              value={password}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
            />
            <button
              className={`form__form-group-button${showPassword ? ' active' : ''}`}
              onClick={e => this.showPassword(e)}
              type="button"
            ><EyeIcon />
            </button>
          </div>
        </div>
        <Button disabled={!name || !password} color="primary" className="btn btn-primary account__btn account__btn--small" onClick={this.onLogin}>
          { isLoading ? <Spin style={{color: '#fff'}}/> : 'Sign In'}
        </Button>
      </div>
    );
  }
}

export default LogInForm;
