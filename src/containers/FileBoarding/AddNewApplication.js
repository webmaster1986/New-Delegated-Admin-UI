import React, {Component} from 'react';
import {Container, Row, Col} from "reactstrap";
import { Input, Button, Select, message, Modal, Spin} from 'antd';
import {ApiService} from "../../services";

class AddNewApplication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applicationType: [],
            oauthType: [],
            ApplicationDetails: {},
            OAuthDetails: {},
            ApplicationType: '',
            ApplicationName: '',
            OAuthType: '',
            isLoading: false
        };
    }

    componentDidMount() {
        this.getAllSupportedObjects()
    }

    getAllSupportedObjects = async () => {
        this.setState({
            isLoading: true
        });
        const data = await ApiService.getAllSupportedObjects();
        if (!data || data.error) {
            this.setState({
                isLoading: false
            })
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                isLoading: false,
                applicationType: data.applicationType,
                oauthType: data.oauthType
            })
        }
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        })
    }

    onApplicationChange = (event) => {
        const {ApplicationDetails} = this.state;
        ApplicationDetails[event.target.name] = event.target.value
        this.setState({
            ApplicationDetails
        })
    }

    onOAuthTypeChange = (event) => {
        const {OAuthDetails} = this.state;
        OAuthDetails[event.target.name] = event.target.value
        this.setState({
            OAuthDetails
        })
    }

    onSubmitData = async () => {
        this.setState({
            isLoading: true
        })
        const {ApplicationName, ApplicationType, ApplicationDetails, OAuthDetails} = this.state;
        const payload = {
            ApplicationName,
            ApplicationType,
            ApplicationDetails,
            OAuthDetails
        }
        const data = await ApiService.newApp(payload)
        if(!data || data.error){
            this.setState({
                isLoading: false
            })
            return message.error('something is wrong! please try again');
        } else {
            this.setState({
                isLoading: false
            })
        }
    }

    render() {
        const {isAddNewApplication, onToggleAddNewApplication} = this.props;
        const {applicationType, oauthType, ApplicationType, OAuthDetails, isLoading, ApplicationName } = this.state;
        let fields = []
        if (ApplicationType) {
            const selectedAppType = applicationType.find(x => Object.keys(x)[0] === ApplicationType);
            fields = selectedAppType ? selectedAppType[ApplicationType] : []
        }
        let oauthFields = []
        if (OAuthDetails.OAuthType) {
            const selectedOauthType = oauthType.find(x => Object.keys(x)[0] === OAuthDetails.OAuthType);
            oauthFields = selectedOauthType ? selectedOauthType[OAuthDetails.OAuthType] : []
        }
        return (
            <Container className="dashboard application-manage">
                <Modal visible={isAddNewApplication}
                       onCancel={onToggleAddNewApplication}
                       title="Register Application"
                       footer={
                           <div className="modal-btn">
                               <Button type="primary" onClick={this.onSubmitData}>{isLoading ?
                                   <Spin className='color-white'/> : 'Submit'}</Button>
                               <Button type="primary" onClick={onToggleAddNewApplication}>Cancel</Button>
                           </div>

                       }
                       width={1024}>
                    <Row>
                        <Col md={12} sm={12} xs={12}>
                            <form className="form">
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Application Name</span>
                                    <div className="form__form-group-field">
                                        <Input name="ApplicationName" value={ApplicationName} onChange={this.onChange}/>
                                    </div>
                                </div>
                            </form>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                            <form className="form">
                                <div className="form__form-group">
                                    <span className="form__form-group-label">Application Type</span>
                                    <div className="form__form-group-field">
                                        <Select
                                            showSearch
                                            name="ApplicationType"
                                            value={ApplicationType}
                                                onChange={(value) => this.onChange({
                                                    target: {
                                                        name: 'ApplicationType',
                                                        value
                                                    }
                                                })}>
                                            {
                                                (applicationType || []).map((x, i) => {
                                                    return(
                                                        <Select.Option value={Object.keys(x)[0]} key={i}>{Object.keys(x)[0]}</Select.Option>
                                                    )
                                                })
                                            }

                                        </Select>
                                    </div>
                                </div>
                                {
                                    fields.map((x, index) => {
                                        return(
                                            <div className="form__form-group" key={index.toString()}>
                                                {/*<span className="form__form-group-label">{this.props.keyRegexToLabel(x) || ''}</span>*/}
                                                <div className="form__form-group-field">
                                                    <Input name={x} type={x === 'password' ? 'password' : 'text'} value={this.state.ApplicationDetails[x] || ''} placeholder={this.props.keyRegexToLabel(x) || ''} onChange={this.onApplicationChange}/>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </form>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                            <form className="form">
                                <div className="form__form-group">
                                    <span className="form__form-group-label">OAuth Type</span>
                                    <div className="form__form-group-field">
                                        <Select
                                            showSearch
                                            name="ApplicationType"
                                            value={this.state.OAuthDetails.OAuthType}
                                                onChange={(value) => this.onOAuthTypeChange({
                                                    target: {
                                                        name: 'OAuthType',
                                                        value
                                                    }
                                                })}>
                                            {
                                                (oauthType || []).map((x, i) => {
                                                    return(
                                                        <Select.Option value={Object.keys(x)[0]} key={i}>{Object.keys(x)[0]}</Select.Option>
                                                    )
                                                })
                                            }

                                        </Select>
                                    </div>
                                </div>
                                {
                                    oauthFields.map((x, index) => {
                                        return(
                                            <div className="form__form-group" key={index.toString()}>
                                                {/*<span className="form__form-group-label">{this.props.keyRegexToLabel(x) || ''}</span>*/}
                                                <div className="form__form-group-field">
                                                    <Input name={x} type={x === 'password' ? 'password' : 'text'} value={this.state.OAuthDetails[x] || ''} placeholder={this.props.keyRegexToLabel(x) || ''} onChange={this.onOAuthTypeChange}/>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </form>
                        </Col>
                    </Row>

                </Modal>
            </Container>

        )
    }
}

export default AddNewApplication

