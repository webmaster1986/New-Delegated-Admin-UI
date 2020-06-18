import React, {Component} from 'react';
import {Card, CardBody, CardHeader, Col, Container, Row,} from "reactstrap";
import {
    Button,
    Checkbox,
    DatePicker,
    Icon,
    Input,
    Progress,
    Table,
    message,
    Spin,
    Switch,
    Select,
    InputNumber
} from "antd";
import {ApiService} from "../../services/ApiService";

class Administration extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            notificationStatus: 'ON',
            testingStatus: 'ON',
            defaultFromAddress: '',
            mailhost: '',
            mailport: '',
            authUserID: '',
            authPassword: '',
            TLSProtocol: '',
            toAddresses: [],
            tenantID: '',
            toEmailAddress: '',
            isSaving: false,
            isLoading: false,
        };
    }

    componentDidMount() {
        this.getSMTP()
    }

    onChangeSwitch = (checked, key) => {
        if(key === 'testingStatus'){
            this.setState({
                testingStatus: checked ? 'ON' : 'OFF'
            });
        }else {
            this.setState({
                notificationStatus: checked ? 'ON' : 'OFF'
            });
        }

    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    getSMTP = async () => {
        this.setState({
            isLoading: true,
        });
        const data = await this._apiService.getSMTP()
        if(!data || data.error){
            this.setState({
                isLoading: false,
            });
            return message.error('Something is wrong! Please try again.')
        } else {
            this.setState({
                notificationStatus: data.notification.notificationStatus,
                testingStatus: data.notification.testingMode.testingStatus,
                defaultFromAddress: data.notification.defaultFromAddress,
                mailhost: data.smtp.mailhost,
                mailport: data.smtp.mailport,
                authUserID: data.smtp.authUserID,
                authPassword: data.smtp.authPassword,
                TLSProtocol: '',
                tenantID: data.tenantID,
                isAuthenticationRequired: data.smtp.isAuthenticationRequired,
                toAddresses: (data.notification.testingMode.toAddresses || []).join(','),
                isLoading: false,
            })
        }
    }

    onSubmitEmail = async () => {
        this.setState({
            isSaving: true
        });
        const {defaultFromAddress, mailhost, mailport, authUserID, authPassword, tenantID, isAuthenticationRequired, toAddresses, testingStatus, notificationStatus} = this.state;
        const payload = {
            smtp: {
                mailhost,
                mailport,
                isAuthenticationRequired,
                authUserID,
                authPassword
            },
            notification: {
                notificationStatus,
                defaultFromAddress,
                testingMode: {
                    testingStatus,
                    toAddresses: (toAddresses || '').split(',').filter(x => x).map(x => x.trim())
                }
            },
        }

        const data = await ApiService.createEmailStoreSMTP(payload)
        if(!data || data.error){
            this.setState({
                isSaving: false
            });
            return message.error('Something is wrong! Please try again.')
        }else {
            this.setState({
                isSaving: false
            });
            return message.success('Email store SMTP create successfully')
        }
    }

    selectChange = (e) => {
        this.setState({
            toAddresses: e.target.value
        })
    }

    onDeleteToAddresses = (index) => {
        const {toAddresses} = this.state;
        this.setState({
            toAddresses: (toAddresses || []).filter((x, i) => i !== index)
        })
    }

    onAddToAddresses = e => {
        let toAddresses = this.state.toAddresses.concat([''])
        this.setState({
            toAddresses
        })
    }

    render() {
        const {defaultFromAddress, mailhost, mailport, authUserID, authPassword, TLSProtocol, toAddresses, isSaving, isLoading, testingStatus, notificationStatus, toEmailAddress} = this.state;

        return (
            <Container className="dashboard">
                <Card>
                    <CardHeader className='custom-card-header'>
                        <Row className="main-div">
                            <Col md={10} sm={12} xs={12}>
                                <Col md={6} sm={12} xs={12} className="d-flex">
                                    <span className="cursor-pointer ml-5 mr-5"><a><img src={require("../../images/email.png")} style={{width: 40}}/></a></span>
                                    <h4 className="mt-10">Email Administration</h4>
                                </Col>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        {
                            isLoading ? <Spin className='mt-50 mb-50 custom-loading'/> :
                                <>
                                    <Row className='mt-10'>
                                        <Col md={6} sm={12} xs={12}>
                                            <span><b>From Email address</b></span>
                                            <Input name="defaultFromAddress" value={defaultFromAddress} onChange={this.onChange}/>
                                        </Col>
                                        <Col md={6} sm={12} xs={12} className='text-right'>
                                            <Switch onChange={this.onChangeSwitch} checked={notificationStatus === 'ON' ? true :false } checkedChildren="Enabled"
                                                    unCheckedChildren="Disabled"/>
                                        </Col>
                                    </Row>
                                    <Row className='mt-10'>
                                        <Col md={6} sm={12} xs={12}>
                                            <h4>SMTP Server</h4>
                                            <Row>
                                                <Col md={6} sm={12} xs={12}>
                                                    <span><b>Host</b></span>
                                                    <Input name="mailhost" value={mailhost} onChange={this.onChange}/>
                                                </Col>
                                                <Col md={6} sm={12} xs={12}>
                                                    <span><b>Port</b></span>
                                                    <Input name="mailport" value={mailport} onChange={this.onChange}/>
                                                </Col>
                                                <Col md={6} sm={12} xs={12} className="mt-10">
                                                    <span><b>Username</b></span>
                                                    <Input name="authUserID" value={authUserID} onChange={this.onChange}/>
                                                </Col>
                                                <Col md={6} sm={12} xs={12} className="mt-10">
                                                    <span><b>Password</b></span>
                                                    <Input type='password' name="authPassword" value={authPassword} onChange={this.onChange}/>
                                                </Col>

                                                <Col md={6} sm={12} xs={12} className="mt-10">
                                                    <Switch onChange={(checked) => this.onChangeSwitch(checked, 'testingStatus')} checked={testingStatus === 'ON' ? true : false} checkedChildren="Testing Mode ON" unCheckedChildren="Testing Mode OFF"/>
                                                </Col>
                                                <Col md={6} sm={12} xs={12} className="mt-10"/>
                                                {
                                                    testingStatus === 'ON' ?
                                                <Col md={12} sm={12} xs={12} className="mt-10">
                                                    {/*{(toAddresses || []).map((reminderFrequency, index) => {
                                                    const length = toAddresses.length
                                                        return (
                                                            <Row key={index}>
                                                                <Col md={11} className="mt-10">
                                                                    <Input name="toAddresses" value={reminderFrequency}
                                                                                 onChange={(e)=> this.selectChange(e,index)}/>
                                                                </Col>
                                                                <Col md={1} className="mt-10">
                                                                    {length - 1 === index ?  <Icon type="plus-circle" className="fs-18" onClick={this.onAddToAddresses} theme="twoTone"/> : null}
                                                                    {length - 1 === index ? null :<Icon type="delete" className="fs-18 mr-10" onClick={() => this.onDeleteToAddresses(index)} theme="twoTone"/>}
                                                                </Col>
                                                            </Row>
                                                        )
                                                    })}*/}
                                                    <Input name="toAddresses" value={toAddresses}
                                                           onChange={(e)=> this.selectChange(e)}/>
                                                </Col> : null
                                                }
                                            </Row>
                                        </Col>
                                    </Row>
                                    <div className='pull-right'>
                                        <Button type='primary' onClick={this.onSubmitEmail}>{isSaving ? <Spin size={"small"}/> : 'Save'}</Button>
                                    </div>
                                </>
                        }

                    </CardBody>
                </Card>
            </Container>
        )
    }
}

export default Administration
