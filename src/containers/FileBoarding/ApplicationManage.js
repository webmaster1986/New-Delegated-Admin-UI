import React, {Component} from 'react';
import {Card, CardBody, Container, Row, Col, CardHeader} from "reactstrap";
import {Switch, Input, Icon, Button, Table, message, Modal, Spin} from 'antd';
import {ApiService} from "../../services";
import AddNewApplication from "./AddNewApplication";
import ExpandedRow from "./ExpandedRow";
const {Search} = Input;
class ApplicationManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddNewApplication: false,
            regenerateClientSecret: false,
            isMapping: false,
            isLoading: false,
            isRegenerateTokenLoading: false,
            clientId: props.match.params.clientId,
            isShowExpandRow: false,
            isEdit: false,
            isShowUrl: false,
            expendedRows: [],
            applicationList: [],
            applicationDetails: {},
            selectedRecord: {},
            selectedRegenerateToken: {},
            showAppUrl: '',
            selectedIndex: null,
            searchKey: ''
        };

    }

    componentDidMount() {
        this.getAllApplications()
    }

    getAllApplications = async () => {
        this.setState({
            isLoading: true
        });
        let data = await ApiService.getAllApplications();
        if (!data || data.error) {
            this.setState({
                isLoading: false
            })
            return message.error('something is wrong! please try again');
        } else {
            (data.Applications || []).forEach((x) => {
                x.isEdit = false
            })
            this.setState({
                isLoading: false,
                applicationList: data.Applications
            })
        }
    }

    onUpload = (ApplicationID) =>{
        const {clientId} = this.state;
        this.props.history.push(`/${clientId}/admin/attributemapping/${ApplicationID}`)
    }

    regenerateToken = async () => {
        this.setState({
            isRegenerateTokenLoading: true
        });
        const {selectedRegenerateToken, applicationList} = this.state;
        const payload = {
            OldAPIToken: selectedRegenerateToken.APIToken
        }
        const data = await ApiService.regenerateToken(selectedRegenerateToken.ApplicationID, payload)
        if (!data || data.error) {
            this.setState({
                isRegenerateTokenLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            selectedRegenerateToken.APIToken  = data.NewAPIToken;
            const Index = applicationList.findIndex(x => x.ApplicationID === data.ApplicationID);
            if (Index > -1) {
                applicationList[Index].APIToken = data.NewAPIToken;
            }
            this.setState({
                selectedRegenerateToken,
                applicationList,
                isRegenerateToken: false,
                isRegenerateTokenLoading: false
            })
        }
    }

    onClick = () => {
        const {clientId} = this.state;
        this.props.history.push(`${clientId}/admin/application/new`)
    }

    customExpandIcon = (props) => {
        if (props.expanded) {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
        } else {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
        }
    }

    onExpandedRowsChange = (data) => {
        const d = []
         d.push(data[data.length-1])
        this.setState({
            expendedRows: d,
            selectedIndex: null,
        });
    }

    onEdit = (record) => {
        const arr = [];
        arr.push(record.ApplicationID)
        this.setState({
            selectedRecord: record,
            expendedRows: arr,
        });
    }

    onToggleAddNewApplication = () => {
        this.setState({
            isAddNewApplication: !this.state.isAddNewApplication
        })
    }

    onToggleRegenerateToken = (record) => {
        this.setState({
            isRegenerateToken: !this.state.isRegenerateToken,
            selectedRegenerateToken: record
        })
    }

    onToggleShowUrl = (record) => {
        this.setState({
            isShowUrl: !this.state.isShowUrl,
            showAppUrl: record.SCIMURL
        })
    }

    onUpdateState = (expendedRows) => {
        this.setState({
            expendedRows,
            selectedRecord: {}
        })
    }

    onFilterData = () => {
        const {applicationList, searchKey} = this.state;
        if (!searchKey) {
            return applicationList;
        }
        let filteredData = applicationList;
            filteredData = filteredData.filter(x => {
                return (x.ApplicationName.toLowerCase().includes(searchKey.toLowerCase()) || x.ApplicationType.toLowerCase().includes(searchKey.toLowerCase()))
            })
        return filteredData
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onCopy = () => {
        const el = this.span;
        el.select()
        document.execCommand("copy")
    };

    onCancel = () => {
        this.setState({
            expendedRows: [],
            selectedRecord: {}
        })
    }

    getColumns = () => {
        return [
            {
                title: 'APPLICATION NAME',
                dataIndex: 'ApplicationName'
            },
            {
                title: 'TYPE',
                dataIndex: 'ApplicationType',
            },
            {
                title: 'API TOKEN',
                render: (record) =><Button size={"default"} type="primary" onClick={() => this.onToggleRegenerateToken(record)}>SHOW TOKEN</Button>
            },
            {
                title: 'APP URL',
                render: (record) =><Button size={"default"} type="primary" onClick={() => this.onToggleShowUrl(record)}>SHOW URL</Button>
            },
            {
                title: 'ACTIVE',
                render: () =><Switch defaultChecked/>
            },
            {
                title: 'ACTIONS',
                render: (record, data, index) => {
                    return <div>
                        <span className="mr-5 cursor-pointer" onClick={() => this.onEdit(record, index)}><img src={require("../../images/edit-icon.png")} style={{width: 20}}/></span>
                        <span className="cursor-pointer" onClick={() => this.onUpload(record.ApplicationID)}><img src={require("../../images/swap-arrows.png")} style={{width: 20}}/></span>
                    </div>
                }
            },

        ];
    }

    keyRegexToLabel = (key) => {
        return (key && key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\_/g, " ").replace(/\b[a-z]/g, (x) => x.toUpperCase())) || key
    }

    render() {
        const {expendedRows, regenerateClientSecret, isAddNewApplication, searchKey, isRegenerateToken, selectedRegenerateToken, isShowUrl, showAppUrl, applicationDetails, selectedRecord, isRegenerateTokenLoading} = this.state;
        return (
            <Container className="dashboard application-manage">
                <Card>
                    <CardHeader>
                        <Row className="align-items-center">
                            <Col md={6} sm={12} xs={12} className="d-flex">
                                        <span className="cursor-pointer ml-5 mr-5"><a><img
                                            src={require("../../images/website (1).png")} style={{width: 40}}/></a></span>
                                <h4 className="mt-10">Application Management</h4>
                            </Col>
                            <Col md={6} sm={12} xs={12}>
                                <div className="text-right search-box">
                                    <Search
                                        size="large"
                                        placeholder="Search for application"
                                        style={{width: 220}}
                                        className="mr-10"
                                        value={searchKey}
                                        name="searchKey"
                                        onChange={this.onChange}
                                    />
                                    <Button className="square" size={"large"} color="primary" onClick={this.onToggleAddNewApplication}><a><img
                                        src={require("../../images/plus-symbol.png")}
                                        style={{width: 20}}/></a>&nbsp;Add New Application</Button>
                                </div>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md={12} sm={12} xs={12}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col>
                                                <Table className="mr-10"
                                                       columns={this.getColumns()}
                                                       size="small"
                                                       dataSource={this.onFilterData()}
                                                       expandIcon={this.customExpandIcon}
                                                       rowKey={'ApplicationID'}
                                                       onExpandedRowsChange={this.onExpandedRowsChange}
                                                       expandedRowRender={(record) => {
                                                           return (
                                                               <div>
                                                                   <ExpandedRow
                                                                       selectedRecord={selectedRecord}
                                                                       expandedRowRenderRecord={record}
                                                                       onUpdateState={this.onUpdateState}
                                                                       onCancel={this.onCancel}
                                                                       keyRegexToLabel={this.keyRegexToLabel} />
                                                               </div>
                                                           )
                                                       }}
                                                       expandedRowKeys={expendedRows}
                                                       onRow={
                                                           (record, index) => {
                                                               return {
                                                                   className: expendedRows.includes(index) ? 'expanded-tr' : ''
                                                               };
                                                           }
                                                       }
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                {
                    isAddNewApplication &&
                    <AddNewApplication
                        isAddNewApplication={isAddNewApplication}
                        onToggleAddNewApplication={this.onToggleAddNewApplication}
                        keyRegexToLabel={this.keyRegexToLabel}
                    />
                }
                {
                    isRegenerateToken &&
                    <Modal
                        visible={isRegenerateToken}
                        onCancel={this.onToggleRegenerateToken}
                        title="Regenerate Token"
                        footer={
                            <div className="modal-btn">
                                <Button type="primary" onClick={this.regenerateToken}>{isRegenerateTokenLoading ? <Spin/> : 'Regenerate Token'}</Button>
                                <Button  onClick={this.onToggleRegenerateToken}>Cancel</Button>
                            </div>

                        }
                        width={810}
                    >
                        <Row>
                            <Col md={12} sm={12} xs={12}>
                                <span>{selectedRegenerateToken.APIToken}</span>
                            </Col>
                        </Row>
                    </Modal>
                }
                {
                    isShowUrl &&
                    <Modal
                        visible={isShowUrl}
                        onCancel={this.onToggleShowUrl}
                        title={null}
                        footer={
                            <div className="modal-btn">
                                <Button type="primary" onClick={this.onCopy}>Copy</Button>
                            </div>

                        }
                        width={810}
                    >
                        <Row>
                            <Col md={12} sm={12} xs={12}>
                                <input type="text" style={{width: "100%", border: 'none', outline: 'none'}} ref={(span) => this.span = span} value={showAppUrl}/>
                            </Col>
                        </Row>
                    </Modal>
                }
            </Container>

        )
    }
}

export default ApplicationManage

