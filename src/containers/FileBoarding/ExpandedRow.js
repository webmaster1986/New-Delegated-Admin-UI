import React,{Component} from 'react'
import {Col, Row} from "reactstrap";
import {Button, Input, message, Modal, Spin} from "antd";
import {ApiService} from "../../services";


class ExpandedRow extends Component{

    state ={
        applicationDetails: {},
        oAuthDetails: {},
        application: {},
        isLoading: false,
        regenerateClientSecret: false,
        showAdminPassword: false
    }

    componentDidMount() {
        this.getAppDetails()
    }

    getAppDetails = async () => {
        const {expandedRowRenderRecord} = this.props;
        const payload = {
            APIToken: expandedRowRenderRecord.APIToken
        }
        const data = await ApiService.getAppDetails(expandedRowRenderRecord.ApplicationID, payload)
        if (!data || data.error) {
            this.setState({
                isLoading: false
            })
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                isLoading: false,
                application: data.Application,
                oAuthDetails: data.Application.OAuthDetails,
                applicationDetails: data.Application.ApplicationDetails,
            })
        }

    }

    onChangeOAuthDetails = (event) => {
        const {oAuthDetails} = this.state;
        oAuthDetails[event.target.name] = event.target.value;
        this.setState({
            oAuthDetails
        })
    }

    onChangeApplicationDetails = (event) => {
        const {applicationDetails} = this.state;
        applicationDetails[event.target.name] = event.target.value;
        this.setState({
            applicationDetails
        })
    }

    onUpdateApp = async () => {
        this.setState({
            isLoading: true
        });
        const {expandedRowRenderRecord} = this.props;
        const {applicationDetails, oAuthDetails} = this.state;
        const payload = {
            OldAPIToken: expandedRowRenderRecord.APIToken,
            ApplicationDetails: applicationDetails,
            OAuthDetails: oAuthDetails,
        }
        const data = await ApiService.updateApp(expandedRowRenderRecord.ApplicationID, payload)
        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            this.props.onUpdateState([])
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                isLoading: false
            });
            this.getAppDetails();
            this.props.onUpdateState([])
        }
    }

    onToggleRegenerateClientSecret = (key) => {
        this.setState({
            [key]: !this.state[key]
        })
    }

    regenerateClientSecret = async () => {
        const {oAuthDetails, application} = this.state
        const payload = {
            clientID: oAuthDetails.clientID
        }
        const data = await ApiService.regenerateClientSecret(application.ApplicationID, payload)
        if (!data || data.error) {
            return message.error('something is wrong! please try again');
        } else {
            const obj = {...oAuthDetails, clientID: data.clientID, clientSecret: data.clientSecret}
            this.setState({
                oAuthDetails: obj
            })
        }
    }

    mouseoverPass = (key, name, type) => {
        if(name === "password"){
            const obj = document.getElementById(key);
            obj.type = type;
        }
    }

    render() {
        const {applicationDetails, oAuthDetails, application, isLoading, regenerateClientSecret, showAdminPassword} = this.state;
        const {expandedRowRenderRecord, selectedRecord, onCancel} = this.props;
        return(
            <div>
                <div className="expand-header">
                    {expandedRowRenderRecord.ApplicationID ===  selectedRecord.ApplicationID ?
                        <>
                            <Row className="mt-10">
                                <Col md={12} sm={12} xs={12}>
                                    <p>Application Name : <b>CorporateDirectory</b></p>
                                </Col>
                            </Row>
                            <Row className="mt-30">
                                <Col md={6} sm={12} xs={12}>
                                    <h5>Application Details</h5>
                                    <Row className="mt-10 align-items-center">
                                        <Col md={4} sm={12} xs={12}>
                                            <p><b>Application Type:</b></p>
                                        </Col>
                                        <Col md={8} sm={12} xs={12}>
                                            <Input value={application && application.ApplicationType} name="ApplicationType"  disabled={true}/>
                                        </Col>
                                    </Row>
                                    {
                                        applicationDetails && Object.keys(applicationDetails).map((x, index) => {
                                            return(
                                                <Row className="mt-10 align-items-center" key={index.toString()}>
                                                    <Col md={4} sm={12} xs={12}>
                                                        <p><b>{this.props.keyRegexToLabel(x)}:</b></p>
                                                    </Col>
                                                    <Col md={8} sm={12} xs={12}>
                                                        <Input
                                                            value={applicationDetails[x]}
                                                            type={"text"}
                                                            name={x}
                                                            id={`${expandedRowRenderRecord.ApplicationID}${x}`}
                                                            onChange={this.onChangeApplicationDetails}
                                                            // onMouseOver={() => this.mouseoverPass(key, x === "password" ? "password" : x, "text")}
                                                            // onMouseOut={() => this.mouseoverPass(key,x === "password" ? "password" : x, "password")}
                                                        />
                                                    </Col>
                                                </Row>
                                            )
                                        })
                                    }

                                </Col>
                                <Col md={6} sm={12} xs={12}>
                                    <h5>OAuth Details</h5>
                                    {
                                        oAuthDetails && Object.keys(oAuthDetails).map((x, index) => {
                                            return (
                                                <div key={index.toString()}>
                                                    {
                                                        (x === 'clientSecret' || x === 'adminPassword') ? null :
                                                            <Row className="mt-10 align-items-center">
                                                                <Col md={4} sm={12} xs={12}>
                                                                    <p><b>{this.props.keyRegexToLabel(x)}:</b></p>
                                                                </Col>
                                                                <Col md={8} sm={12} xs={12}>
                                                                    <Input value={oAuthDetails[x]} name={x} onChange={this.onChangeOAuthDetails}/>
                                                                </Col>
                                                            </Row>
                                                    }
                                                </div>
                                            );
                                        })
                                    }
                                    <Row className="mt-10 align-items-center">
                                        <Col md={12} sm={12} xs={12}>
                                            <Button type="primary" onClick={() => this.onToggleRegenerateClientSecret("showAdminPassword")}>Show Admin password</Button>
                                        </Col>
                                    </Row>
                                    <Row className="mt-10 align-items-center">
                                        <Col md={12} sm={12} xs={12}>
                                            <Button type="primary" onClick={() => this.onToggleRegenerateClientSecret("regenerateClientSecret")}>Show Client Secret</Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="mt-10">
                                <Col md={12} sm={12} xs={12}>
                                   <div className="pull-right">
                                       <Button type="primary" className="mr-10" onClick={this.onUpdateApp}>{isLoading ?
                                           <Spin className='color-white'/> :'Submit' }</Button>
                                       <Button onClick={onCancel}>Cancel</Button>
                                   </div>
                                </Col>
                            </Row>
                        </> : <Row className="mt-10">
                            <Col md={6} sm={12} xs={12}>
                                <h4>Application Details</h4>
                                {
                                    applicationDetails && Object.keys(applicationDetails).map((x, index) => {
                                        return (
                                            <Row className="mt-10" key={index.toString()}>
                                                <Col md={6} sm={12} xs={12}>
                                                    <p><b>{this.props.keyRegexToLabel(x)}: </b></p>
                                                </Col>
                                                <Col md={6} sm={12} xs={12}>
                                                    { x === "password" ?
                                                        <Input
                                                            value={applicationDetails[x]}
                                                            type={"password"}
                                                            name={x}
                                                            id={`${expandedRowRenderRecord.ApplicationID}${x}`}
                                                            style={{border: "none", padding: 0, color: "#3e426a"}}
                                                        /> :
                                                        <p>{applicationDetails[x]}</p>
                                                    }
                                                </Col>
                                            </Row>

                                        );
                                    })
                                }
                            </Col>
                            <Col md={6} sm={12} xs={12}>
                                <h4>OAuth Details</h4>
                                {
                                    oAuthDetails && Object.keys(oAuthDetails).map((x, index) => {
                                        return (
                                            <div>
                                                {x === "adminPassword" || x === "clientSecret" ? null :
                                                    <Row className="mt-10" key={index.toString()}>

                                                        <Col md={6} sm={12} xs={12}>
                                                            <p><b>{this.props.keyRegexToLabel(x)}: </b></p>
                                                        </Col>
                                                        <Col md={6} sm={12} xs={12}>
                                                            <p>{oAuthDetails[x]}</p>
                                                        </Col>
                                                    </Row>
                                                }
                                            </div>
                                        );
                                    })
                                }
                            </Col>
                        </Row>
                    }
                </div>
                {
                    regenerateClientSecret &&
                    <Modal  visible={regenerateClientSecret}
                            onCancel={() => this.onToggleRegenerateClientSecret("regenerateClientSecret")}
                            title="Regenerate Client Secret"
                            footer={
                                <div className="modal-btn">
                                    <Button type="primary" onClick={this.regenerateClientSecret}>Regenerate Secret</Button>
                                    <Button onClick={() => this.onToggleRegenerateClientSecret("regenerateClientSecret")}>Cancel</Button>
                                </div>

                            }
                            width={810}>
                        <Row>
                            <Col md={12} sm={12} xs={12}>
                                <span>{oAuthDetails && oAuthDetails.clientSecret}</span>
                            </Col>
                        </Row>

                    </Modal>
                }
                {
                    showAdminPassword &&
                    <Modal  visible={showAdminPassword}
                            onCancel={() => this.onToggleRegenerateClientSecret("showAdminPassword")}
                            title="Admin Password"
                            footer={
                                <div className="modal-btn">
                                    <Button type="primary" onClick={() => this.onToggleRegenerateClientSecret("showAdminPassword")}>Ok</Button>
                                    <Button onClick={() => this.onToggleRegenerateClientSecret("showAdminPassword")}>Cancel</Button>
                                </div>

                            }
                            width={810}>
                        <Row>
                            <Col md={12} sm={12} xs={12}>
                                <span>{oAuthDetails && oAuthDetails.adminPassword}</span>
                            </Col>
                        </Row>

                    </Modal>
                }
            </div>
        )
    }
}

export default ExpandedRow
