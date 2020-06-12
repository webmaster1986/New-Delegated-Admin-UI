import React, {Component} from 'react';
import {Button} from "reactstrap";
import {Input, Select, message, Spin} from "antd";
import {ApiService} from "../../services";
import MainWrapper from "../App/MainWrapper";

class Register extends Component {
    _apiService = new ApiService();
    constructor(props) {
        super(props);
        this.state = {
            applicationType: '',
            currentClientId: this.props.match.params.clientId,
            OAUTH_TENANT_ENDPOINT_URL: '',
            OAUTH_TENANT_CLIENT_ID: '',
            OAUTH_TENANT_CLIENT_SECRET: '',
            LDAP_SERVER: '',
            LDAP_PORT: '',
            LDAP_USER_SERACHBASE: '',
            tenantId: '',
            isLoading: false,
            
        };
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    componentDidMount() {
        this.generateTenantID()
    }

    generateTenantID = async () => {
        const data = await this._apiService.generateTenantID()
        if(!data || data.error){
            return message.error('something is wrong! please try again');
        } else {
           this.setState({
               tenantId: data
           })
        }
    }

    onRegister = async () => {
        this.setState({
            isLoading: true
        });
        const {applicationType, OAUTH_TENANT_ENDPOINT_URL, OAUTH_TENANT_CLIENT_ID, OAUTH_TENANT_CLIENT_SECRET, LDAP_SERVER, LDAP_PORT, LDAP_USER_SERACHBASE, tenantId} = this.state;
        const payload = applicationType === 'LDAP' ?
          {LDAP_SERVER, LDAP_PORT, LDAP_USER_SERACHBASE} :
          {OAUTH_TENANT_ENDPOINT_URL, OAUTH_TENANT_CLIENT_ID, OAUTH_TENANT_CLIENT_SECRET};
        const response = await ApiService.registration(tenantId, applicationType, payload);
        if(!response || response.error) {
            this.setState({
                isLoading: false
            });
           return message.error('something is wrong! please try again');
        } else {
           if(response === 'SUCCESS'){
               this.setState({
                   isLoading: false
               });
               window.location.href = `/iga/${tenantId}/`;
           } else {
               this.setState({
                   isLoading: false
               });
               return message.error('something is wrong! please try again');
           }
        }
    }

    render() {
        const {applicationType, OAUTH_TENANT_ENDPOINT_URL, OAUTH_TENANT_CLIENT_ID, OAUTH_TENANT_CLIENT_SECRET, LDAP_SERVER, LDAP_PORT, LDAP_USER_SERACHBASE, tenantId, isLoading} = this.state;
        const isButtonDisable = applicationType === 'LDAP' ?
          !LDAP_SERVER.trim() || !LDAP_PORT.trim() || !LDAP_USER_SERACHBASE.trim() :
          !OAUTH_TENANT_ENDPOINT_URL.trim() || !OAUTH_TENANT_CLIENT_ID.trim() || !OAUTH_TENANT_CLIENT_SECRET.trim()
        return (
            <MainWrapper>
                <main>
                <div className="account">
                <div className="account__wrapper">
                    <div className="account__card">
                        <div className="account__head">
                            <h3 className="account__title">Welcome to
                                <span className="account__logo"> Kapstone
                                    <span className="account__logo-accent">IGA</span>
                                  </span>
                            </h3>
                        </div>
                        <div className="form">
                            <div className="form__form-group">
                                <span className="form__form-group-label">Application Type</span>
                                <div className="form__form-group-field">
                                    <Select className='w-100-p' value={applicationType}
                                            onChange={value => this.onChange({
                                                target: {
                                                    name: 'applicationType',
                                                    value
                                                }
                                            })}>
                                        <Select.Option value={"OKTA"}>OKTA</Select.Option>
                                        <Select.Option value={"IDCS"}>IDCS</Select.Option>
                                        <Select.Option value={"LDAP"}>LDAP</Select.Option>
                                    </Select>
                                </div>
                            </div>
                            <div className="form__form-group">
                                <span className="form__form-group-label">Tenant ID</span>
                                <div className="form__form-group-field">
                                    <Input className='w-100-p' name='tenantId' value={tenantId} onChange={this.onChange}/>
                                </div>
                            </div>
                          {
                            applicationType === 'LDAP' ?
                              <>
                                  <div className="form__form-group">
                                      <span className="form__form-group-label">Server</span>
                                      <div className="form__form-group-field">
                                          <Input className='w-100-p' name='LDAP_SERVER' value={LDAP_SERVER} onChange={this.onChange}/>
                                      </div>
                                  </div>
                                  <div className="form__form-group">
                                      <span className="form__form-group-label">Port</span>
                                      <div className="form__form-group-field">
                                          <Input className='w-100-p' name='LDAP_PORT' value={LDAP_PORT} onChange={this.onChange}/>
                                      </div>
                                  </div>
                                  <div className="form__form-group">
                                      <span className="form__form-group-label">Search User Base</span>
                                      <div className="form__form-group-field">
                                          <Input className='w-100-p' name='LDAP_USER_SERACHBASE' value={LDAP_USER_SERACHBASE} onChange={this.onChange}/>
                                      </div>
                                  </div>
                              </>
                              :
                              <>
                                  <div className="form__form-group">
                                      <span className="form__form-group-label">Endpoint</span>
                                      <div className="form__form-group-field">
                                          <Input className='w-100-p' name='OAUTH_TENANT_ENDPOINT_URL' value={OAUTH_TENANT_ENDPOINT_URL} onChange={this.onChange}/>
                                      </div>
                                  </div>
                                  <div className="form__form-group">
                                      <span className="form__form-group-label">Client Id</span>
                                      <div className="form__form-group-field">
                                          <Input className='w-100-p' name='OAUTH_TENANT_CLIENT_ID' value={OAUTH_TENANT_CLIENT_ID} onChange={this.onChange}/>
                                      </div>
                                  </div>
                                  <div className="form__form-group">
                                      <span className="form__form-group-label">Client Secret</span>
                                      <div className="form__form-group-field">
                                          <Input className='w-100-p' name='OAUTH_TENANT_CLIENT_SECRET' value={OAUTH_TENANT_CLIENT_SECRET} onChange={this.onChange}/>
                                      </div>
                                  </div>
                              </>
                          }
                            
                            <Button disabled={!applicationType || isButtonDisable || !tenantId}
                                    color="primary" className="btn btn-primary account__btn account__btn--small" onClick={this.onRegister}>
                                { isLoading ? <Spin className='color-white'/> : 'Register'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
                </main>
            </MainWrapper>
        )
    }
}

export default Register;

