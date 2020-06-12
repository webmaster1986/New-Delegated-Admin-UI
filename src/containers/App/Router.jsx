import React, {Suspense, Component} from 'react';
import { Route, Switch } from 'react-router-dom';
import { ApiService, SessionStorageService } from '../../services';
import { connect } from 'react-redux';
import MainWrapper from './MainWrapper';
import MainContainer from './MainContainer';
import LogIn from '../LogIn';
import {message} from "antd";
import { setAuthDetails } from '../../redux/actions/authAction';
import Cookies from "universal-cookie";

class Router extends Component {

  constructor() {
    super();
    this.state = {
      loading: true,
      isLoading: true,
      configData: {},
      isValidClient: false,
    };
  }

  async componentDidMount() {
      const currentClientId = this.props.match.params.clientId;
    const payload = {
      registeredAppName: this.props.match.params.clientId
    };
    const data = await ApiService.getConfigForClient(payload);
    if (!data || data.error) {
      this.setState({
        isLoading: false,
        isValidClient: false,
      });
    } else {
      this.setState({
        isValidClient: true,
      });
      const cookies = new Cookies();
      const accessToken = cookies.get('JWT_ACCESSTOKEN');
      const registeredClientId = cookies.get('REGISTERED_APPNAME');
      if (data.AuthType === 'LOCAL') {
        if (accessToken && registeredClientId === currentClientId) {
          const newPayload ={
            registeredAppName: currentClientId,
            accessToken: accessToken
          };
          const response = await ApiService.verifyToken(newPayload);
          if(!response || response.error){
            this.setState({
              isLoading: false,
            });
            return this.props.history.push(`/${currentClientId}/login`);
          } else {
            cookies.set('REGISTERED_APPNAME', currentClientId, { path: '/' });
            this.props.setAuthDetails(response);
          }
        } else {
          this.setState({
            isLoading: false,
          });
          return this.props.history.push(`/${currentClientId}/login`);
        }
      } else if (data.AuthType === 'OAUTH') {
        if (accessToken && registeredClientId === currentClientId) {
          const newPayload ={
            registeredAppName: currentClientId,
            accessToken: accessToken
          };
          const response = await ApiService.verifyToken(newPayload);
          if(!response || response.error){
            return window.location.replace(data.OAuthRequestURL);
          } else {
            cookies.set('REGISTERED_APPNAME', currentClientId, { path: '/' });
            this.props.setAuthDetails(response);
          }
        } else {
           window.location.replace(data.OAuthRequestURL);
          return;
        }
      }

      this.setState({
        configData: data || {},
        isLoading: false,
        isValidClient: true,
      });
    }
  }

  render() {
    const {isLoading, isValidClient} = this.state;

    if (isLoading) {
      return (
        <div className={`load`}>
          <div className="load__icon-wrap">
            <svg className="load__icon">
              <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
            </svg>
          </div>
        </div>
      );
    }

    if (!isValidClient) {
      return <h1>Tenant is not valid!</h1>
    }

    return (
      <MainWrapper>
        <main>
          <Switch>
            <Route path="/:clientId/login" component={LogIn}/>
            {
              isValidClient && <Route path="/:clientId" render={(props) => <MainContainer configProps={this.state.configProps} {...props} />}/>
            }
          </Switch>
        </main>
      </MainWrapper>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setAuthDetails: (state) => {
    return dispatch(setAuthDetails(state))
  }
});
export default connect(null, mapDispatchToProps)(Router)

