import React, {Component} from 'react';
import {Card, CardBody, Col, Container, Row, CardHeader} from "reactstrap";
import {Button, Table, message, Spin,} from "antd";
import {ApiService} from "../../services";
import CreateDirect from "./CreateDirect";

const initialState = {
    provider: '',
    description: '',
    jobName: '',
    url: '',
    token: '',
    endpoint: '',
    clientId: '',
    isLoading: false,
    hostname: '',
    port: '',
    selectedRecordIndex: null,
    selectedRecord: null,
    clientSecret: '',
    userSearchBase: '',
    groupSearchBase: '',
    userSearchFilter: '',
    groupSearchFilter: '',
    isAddMod: false,
    username: '',
    password: '',
    name: '',
    runNow: false,
    appid: '',
    apiToken: '',
    isTrustedSource: 'no',
    ownerName: '',
    linkedHRAttribute: '',
    ownerId: ''
}

class Direct extends Component {
    _apiServices = new ApiService()
    state = {
        isEdit: false,
        applicationData: [],
        ...initialState
    };

    componentDidMount() {
        this.getDirectSources()
    }

    getDirectSources = async () => {
        this.setState({
            isLoading: true
        });
        let data = await this._apiServices.getDirectSources();
        if (!data || data.error) {
            this.setState({
                isLoading: false
            })
            return message.error('something is wrong! please try again');
        } else {
            if (!Array.isArray(data)) {
                data = [data];
            }
            this.setState({
                isLoading: false,
                applicationData: data
            })
        }

    }

    onAddMode = () => {
        this.setState({
            isAddMod: true,
        });
    }

    onEdit = (selectedRecord, selectedRecordIndex) => {
        const newState = selectedRecord;
        if(selectedRecord.provider === "AD" || "LDAP"){
            newState.password = '****';
        }
        this.setState({
            ...newState,
            isEdit: true,
            isAddMod: true,
            selectedRecord,
            selectedRecordIndex
        });
    }

    onSubmitData = async (type) => {
        const {isEdit, provider, description, url, userSearchBase, username, password, endpoint, groupSearchBase, userSearchFilter, groupSearchFilter,
            port, hostname, clientId, clientSecret, token, selectedRecordIndex, runNow, name, jobName, ownerName, ownerId, linkedHRAttribute, isTrustedSource, appid, apiToken} = this.state;
        let {applicationData} = this.state;
        let payload = {};
        if (type === 'OKTA') {
            payload = {name, description, url, token, runNow};
        } else if (type === 'IDCS') {
            payload = {name, description, endpoint, clientId, clientSecret, runNow};
        } else if (type === 'LDAP' || type === 'AD') {
            payload = {name, description, hostname, port, username, userSearchBase, groupSearchBase, userSearchFilter, groupSearchFilter, runNow};
        } else if (type === 'AWS') {
            payload = {name, description, appid, apiToken, isTrustedSource, ownerName, ownerId, linkedHRAttribute, runNow};
        }
        if (isEdit && (selectedRecordIndex || selectedRecordIndex === 0)) {
            this.setState({
                isLoading: true
            });
            const data = await ApiService.updateDirectAuthcontroller(provider,{...payload, provider, jobName});
            if(!data || data.error){
                this.setState({
                    isLoading: false
                });
                return message.error('something is wrong! please try again');
            } else {
                applicationData = data;
                this.setState({
                    applicationData,
                    selectedRecordIndex: null,
                    isEdit: false,
                    selectedRecord: null,
                    isLoading: false
                });
            }
        } else {
            // if (type !== 'LDAP') {
            this.setState({
                isLoading: true
            });
            const data = await ApiService.directAuthcontroller(provider, payload);
            this.setState({
                isLoading: false
            });
            if (!data || data.error) {
                this.setState({
                    isLoading: false
                });
                return message.error('something is wrong! please try again');
            } else {
                //await ApiService.LoadDirectScheduler(type, name);
                applicationData = data;
                message.success('Data saved successfully!');
            }
        }
        this.setState({
            ...initialState,
            applicationData,
            selectedRecordIndex: null,
            isEdit: false,
            selectedRecord: null,
            isLoading: false
        });
    }

    onJobRun = async (record) => {
        await ApiService.LoadDirectScheduler(record.jobName);
        message.success('Job has been submitted!');
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    getColumns = () => {
        return [
            {
                title: 'Application Name',
                dataIndex: 'name'
            },
            {
                title: 'Type',
                dataIndex: 'provider',
            },
            {
                title: 'Description',
                dataIndex: 'description',
            },
            {
                title: '',
                render: (record, data, index) => {
                    return <div>
            <span className="mr-5" onClick={() => this.onEdit(record, index)}><a><img
                src={require('../../images/edit.png')} style={{width: 18}}/></a></span>&nbsp;
                        <span><a><img onClick={() => this.onJobRun(record)} src={require('../../images/run.png')}
                                      style={{width: 19}}/></a></span>
                    </div>
                }
            },

        ];
    }

    onCancel = () => {
        this.setState({
            isEdit: false,

            ...initialState
        })
    }

    checkBoxChange = (event) => {
        let value = event.target.checked;
        if (event.target.name === 'isTrustedSource') {
            value = value ? 'yes' : 'no'
        }
        this.setState({
            [event.target.name]: value
        })
    }

    render() {
        const {isEdit, applicationData, isLoading, isAddMod} = this.state;
        return (
            <Container className="dashboard">
                <Card>
                    <CardHeader className='custom-card-header'>
                        <Row className="main-div">
                            <Col md={10} sm={12} xs={12}>
                                <Col md={6} sm={12} xs={12} className="d-flex">
                                    <span className="cursor-pointer ml-5 mr-5"><a><img src={require("../../images/sources.png")} style={{width: 40}}/></a></span>
                                    <h4 className="mt-10">Sources</h4>
                                </Col>
                            </Col>
                            <Col md={2} sm={12} xs={12} className="text-right">
                                {!isAddMod && <Button className="square" size={"large"} color="primary" onClick={this.onAddMode}><a><img src={require("../../images/plus-symbol.png")} style={{width: 18}}/></a>&nbsp;Add Source</Button>}
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        {
                            !isAddMod ?
                                <Row>
                                    <Col md={12} sm={12} xs={12}>
                                        {
                                            isLoading ? <Spin className='mt-50 custom-loading'/> :
                                                <Table className="mr-10" columns={this.getColumns()} size="small" dataSource={applicationData}/>
                                        }
                                    </Col>
                                </Row> :
                                <CreateDirect
                                    {...this.state}
                                    onChange={this.onChange}
                                    checkBoxChange={this.checkBoxChange}
                                    onSubmitData={this.onSubmitData}
                                    onCancel={this.onCancel}
                                    isEdit={isEdit}
                                />
                        }
                    </CardBody>
                </Card>
            </Container>
        )
    }
}

export default Direct
