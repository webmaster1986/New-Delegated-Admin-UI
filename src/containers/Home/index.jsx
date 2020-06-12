import React, {Component} from 'react';
import {Card, CardBody, Col, Container, Row,} from 'reactstrap';
import clonedeep from "lodash.clonedeep";
import {omit} from "lodash";
import Panel from '../../../src/shared/components/Panel'
import {
    Select, Icon, Table, Dropdown, Menu, Modal, Drawer, Checkbox, Slider, Input, message, Spin, Progress,
    Tabs, Tooltip, Button, Breadcrumb
} from 'antd';
import { getDueColor } from '../../services/constants';

const {TextArea} = Input;
const {Option} = Select;
const {TabPane} = Tabs;
import './Home.scss';
import {ApiService} from "../../services/ApiService";
import moment from "moment";
import CardHeader from "reactstrap/es/CardHeader";

const {Search} = Input;

const legendOpts = {
    position: 'right',
};

const colors = ['red', 'green', 'black', 'violet', '#a2a25d'];

const getColor = (index) => {
    const i = index % 5;
    return colors[i] ? colors[i] : colors[0];
}

import Cookies from "universal-cookie";
import ApplicationAndEntitlements from "./ApplicationAndEntitlements";
import CustomHeader from "../Layout/CustomHeader";
// import * as XLSX from "xlsx";
import XLSXDownloadButton from "./components/XLSXDownloadButton";

const cookies = new Cookies();
const getUserName = () => {
    return cookies.get('LOGGEDIN_USERID');
}

class HomePage extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            certificationId: this.props.match.params.id,
            clientId: this.props.match.params.clientId,
            legend: legendOpts,
            activeTab: '1',
            isModal: false,
            isDrawer: false,
            isInfoModal: false,
            isAdvanceSearch: false,
            isLoading: false,
            isLoadingUser: false,
            isApplicationApprove: false,
            isChangeTable: false,
            bulkDecisions: '',
            columns: '',
            groupBy: '',
            filter: '',
            certificate: {},
            userDetails: {},
            activeKey: '',
            selectedRecord: {},
            count: 0,
            reviewList: [],
            apps: [],
            members: [],
            selectedApp: [],
            selectedEnt: [],
            selectedCertification: [],
            searchUser: '',
            comment: {
                appId: '',
                entId: '',
                text:  '',
            },
            campaignId: ''

        };
        this.applyLegendSettings = this.applyLegendSettings.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            this.getCertificateUsers(this.props.match.params.id)
        }
    }

    getCertificateUsers = async (certificationId) => {
        this.setState({
            isLoading: true
        });
        const data = await this._apiService.getCertificateUsers(certificationId)
        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            let members = (data.members || []).map((x, i) => ({
                ...x,
                id: i + 1,
                color: getColor(i),
            }));
            this.setState({
                certificate: data,
                // activeKey: data.members[0].userInfo.UserName,
                members,
                isLoading: false,
                campaignId: data.campaignId
            });
            // this.getUserDetails(data.members[0].userInfo.UserName, data.campaignId)
        }
    }

    applyLegendSettings() {
        const {value} = this.legendOptsInput;
        try {
            const opts = JSON.parse(value);
            this.setState({
                legend: opts,
            });
        } catch (e) {
            alert(e.message);
            throw Error(e);
        }
    }

    toggle = (tab) => {
        const {activeTab} = this.state;
        if (activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    };

    showModal = () => {
        this.setState({
            isModal: true,
        });
    };

    handleCancel = () => {
        this.setState({
            isModal: false,
        });
    };

    showDrawer = () => {
        this.setState({
            isDrawer: true,
        });
    };

    showInfoDrawer = (selectedRecord, type) => {
        this.setState({
            isInfoModal: true,
            selectedRecord,
            selectedModalType: type
        });
    };

    onClose = () => {
        this.setState({
            isDrawer: false,
        });
    };

    onCloseInfoDrawer = () => {
        this.setState({
            isInfoModal: false,
            selectedRecord: null
        });
    };

    formatter = (value) => {
        return `${value}%`;
    }

    drawer = () => {
        return (
            <Drawer
                title={'Smart Suggestions Parameters'}
                width={400}
                onClose={this.onClose}
                visible={this.state.isDrawer}
                placement={'left'}
            >
                <Row>
                    <Col md={7}>
                        <div className='w-100-p text-center'><span><b>Last Login</b></span></div>
                    </Col>
                    <Col md={5}>
                        <span><b>Click To Disable</b></span>
                    </Col>
                </Row>
                <Row className="align-items-center">
                    <Col md={7} className="mt-10">
                        <Slider marks={{0: '< 60 Days', 1: '< 180 Days', 2: '< 360 Days'}} tooltipVisible={false}
                                defaultValue={0}
                                min={0} max={2}/>
                    </Col>
                    <Col md={5} className="mt-10">
                        <Checkbox className='w-80-p text-center'/>
                    </Col>
                </Row>
                <Row className="mt-40">
                    <Col md={8}>
                        <div className='w-100-p text-center'><span><b>Last Certification Decision</b></span></div>
                    </Col>
                </Row>
                <Row className="align-items-center">
                    <Col md={7} className="mt-10">
                        <Slider min={0} max={2} marks={{0: 'Certified', 1: 'Certified Conditionally', 2: 'Revoked',}}
                                tooltipVisible={false}/>
                    </Col>
                    <Col md={5} className="mt-10">
                        <Checkbox className='w-80-p text-center'/>
                    </Col>
                </Row>
                <Row className="mt-40">
                    <Col md={8}>
                        <div className='w-100-p text-center'><span><b>Entity Risk</b></span></div>
                    </Col>
                </Row>
                <Row className="align-items-center">
                    <Col md={7} className="mt-10">
                        <Slider min={0} max={2} marks={{0: 'Low', 1: 'Medium', 2: 'High'}} tooltipVisible={false}/>
                    </Col>
                    <Col md={5} className="mt-10">
                        <Checkbox className='w-80-p text-center'/>
                    </Col>
                </Row>
                <Row className="mt-40">
                    <Col md={8}>
                        <div className='w-100-p text-center'><span><b>Similar Access across Division</b></span></div>
                    </Col>
                </Row>
                <Row className="align-items-center row-height">
                    <Col md={7} className="mt-10">
                        <Slider tipFormatter={this.formatter} tooltipVisible={this.state.isDrawer}
                                marks={{0: '0 %', 100: '100%',}}
                                tooltipPlacement={"bottom"}/>
                    </Col>
                    <Col md={5} className="mt-10">
                        <Checkbox className='w-80-p text-center'/>
                    </Col>
                </Row>
                <Row>
                    <Col className="w-100-p text-center">
                        <Button className="square  ml-15 mb-0" size={"sm"} color="primary">Save</Button>
                        <Button className="square  mb-0" size={"sm"}>Reset</Button>
                    </Col>
                </Row>
            </Drawer>
        )
    }

    modal = () => {
        return (
            <Modal
                visible={this.state.isModal}
                onCancel={this.handleCancel}
                title="Comments"
                footer={null}
                width={410}
            >
                <Row>
                    <Col md={12}>
                        <TextArea
                            placeholder="Comments"
                            autosize={{minRows: 2, maxRows: 6}}
                        />
                    </Col>
                </Row>
            </Modal>
        )
    }

    infoModal = () => {
        const {selectedRecord, selectedModalType} = this.state;
        if (!this.state.isInfoModal || !selectedRecord) {
            return null;
        }
        return (
            <Modal
                width={400}
                onCancel={this.onCloseInfoDrawer}
                visible={this.state.isInfoModal}
                placement={'left'}
                footer={null}
            >
              {
                selectedModalType === 'app' ?
                 <>
                     <Row>
                         <Col md={5}><b>App Name:</b></Col>
                         <Col md={6}><span>{selectedRecord.applicationInfo.applicationName}</span></Col>
                     </Row>
                     <Row>
                         <Col md={5}><b>App Description:</b></Col>
                         <Col md={6}><span>{selectedRecord.applicationInfo.applicationDescription}</span></Col>
                     </Row>
                     <Row>
                         <Col md={5}><b>App Owner:</b></Col>
                         <Col md={6}><span>{selectedRecord.applicationInfo.applicationOwner}</span></Col>
                     </Row>
                 </> :
                  <>
                  <Row>
                      <Col md={5}><b>Account id:</b></Col>
                      <Col md={6}><span>{selectedRecord && selectedRecord.accountId}</span></Col>
                  </Row>
                  <Row>
                      <Col md={5}><b>First Name:</b></Col>
                      <Col md={6}><span></span></Col>
                  </Row>
                  <Row>
                      <Col md={5}><b>Last Name:</b></Col>
                      <Col md={6}><span></span></Col>
                  </Row>
                  </>

              }

            </Modal>
        )

    }

    onToggleComment = (appId, entId, text) => {
        this.setState({
            isComment: !this.state.isComment,
            comment: {
                appId: appId,
                entId: entId,
                text: text || '',
            }
        });
    }

    onChangeComment = (event) => {
        const {comment} = this.state;
        comment.text = event.target.value;
        this.setState({
            comment
        })
    }

    onSaveComment = () => {
        const {comment, apps} = this.state;
        apps[comment.appId].entityEntitlements[comment.entId].newComment = comment.text;
        this.setState({
            apps,
            isComment: false,
            comment: {
                appId: '',
                entId: '',
                text:  '',
            }
        })
    }

    onCancelComment = () => {
        this.setState({
            isComment: false,
            comment: {
                appId: '',
                entId: '',
                text:  '',
            }
        })
    }

    commentModal = () => {
        const {comment} = this.state;
        return (
            <Modal
                width={400}
                onCancel={this.onToggleComment}
                visible={this.state.isComment}
                footer={
                    <div>
                        <Button type="primary" onClick={this.onSaveComment}>Save</Button>
                        <Button  onClick={this.onCancelComment}>Cancel</Button>
                    </div>

                }
            >
                <div className="mr-15"><TextArea placeholder='Comments..' value={comment.text} onChange={this.onChangeComment}/></div>

            </Modal>
        )

    }

    onAdvanceSearch = () => {
        this.setState({
            isAdvanceSearch: !this.state.isAdvanceSearch,
        });
    }

    getUserDetails = async (userName, campaignID) => {
        this.setState({
            isLoadingUser: true
        });
        const data = await this._apiService.getUserDetails(userName, campaignID)
        if (!data && data.error) {
            this.setState({
                isLoadingUser: false,
                apps: [],
                userDetails: {}
            });
            return message.error('something is wrong! please try again');
        } else {
            const apps = (data.userDetails || {}).entityAppinstance || [];
            apps.forEach((app, index) => {
                app.prevAction = app.action ? app.action : 'required';
                app.appId = index;
                app.action = app.action ? app.action : 'required';
                (app.entityEntitlements || []).forEach((ent, i) => {
                    ent.prevAction = ent.action ? ent.action : 'required';
                    ent.action = ent.action ? ent.action : 'required';
                    ent.entId = i;
                });
            });

            this.setState({
                userDetails: data,
                apps: apps,
                isLoadingUser: false,
            });
        }
    }

    onUpdateAppStatus = (index, action) => {
        const {apps} = this.state;
        const currentAction = apps[index].action;
        if (currentAction === action) {
            apps[index].action = 'required';
        } else {
            apps[index].action = action;
        }
        this.setState({
            apps
        });
    };

    onUpdateEntStatus = (index, action, appIndex) => {
        const {apps} = this.state;
        const currentAction = apps[appIndex].entityEntitlements[index].action;
        if (currentAction === action) {
            apps[appIndex].entityEntitlements[index].action = 'required';
        } else {
            apps[appIndex].entityEntitlements[index].action = action;
        }
        this.setState({
            apps
        });
    }

    undoDecisionApp = (appId) => {
        const {apps} = this.state;
        if (apps[appId]) {
            apps[appId].action = apps[appId].prevAction;
        }
        this.setState({
            apps
        });
    }

    undoDecisionEnt = (entId, appId) => {
        const {apps} = this.state;
        if (apps[appId] && apps[appId].entityEntitlements && apps[appId].entityEntitlements[entId]) {
            apps[appId].entityEntitlements[entId].action = apps[appId].entityEntitlements[entId].prevAction;
        }
        this.setState({
            apps
        });
    }

    confirmApproveSelected = () => {
        const {selectedApp, isChangeTable, selectedEnt} = this.state;
        if (isChangeTable && (selectedApp.length || selectedEnt.length)) {
            this.onApproveSelected();
        }
    }

    onUserAction = async (action) => {
        const {selectedCertification, isChangeTable, members, certificate, isSaving} = this.state;
        if (isSaving) {
            return;
        }
        if (!isChangeTable && certificate && (selectedCertification.length)) {
            const selectedMembers = members.filter(x => selectedCertification.includes(x.id)).map(x => x.userInfo.UserName);
            if (selectedMembers.length) {
                const payload = {
                    certificationID: String(certificate.certificationId),
                    campaignID: String(certificate.campaignId),
                    action: action,
                    reviewerID: getUserName(),
                    members: selectedMembers
                };
                this.setState({
                    isSaving: true,
                });
                const data = await ApiService.bulkAction(payload);
                if (!data || data.error || data.status === 'failed') {
                    if (data.status && data.response) {
                        message.error(data.response);
                    } else {
                        message.error('Something went wrong. please try again.');
                    }
                    return this.setState({
                        isSaving: false,
                    });
                } else {
                    this.setState({
                        isSaving: false,
                        selectedCertification: []
                    });
                    message.success('action submitted successfully');
                    this.getCertificateUsers(this.props.match.params.id);
                }
            }
        }
    }

    confirmRevokeSelected = () => {
        const {selectedApp, isChangeTable, selectedEnt} = this.state;
        if (isChangeTable && (selectedApp.length || selectedEnt.length)) {
            this.onRevokeSelected();
        }
    }

    onSelectAll = (e) => {
        let {apps, selectedApp, selectedEnt, members, selectedCertification} = this.state;
        if (e.target.checked) {
            (apps || []).map((x) => {
                selectedApp.push(x.appId);
            });
            (apps || []).map((x) => {
                // selectedApp.push(x.appId);
                const ent = {
                    appId: x.appId,
                    entIds: (x.entityEntitlements || []).map(y => y.entId)
                };
                selectedEnt.push(ent);
            });
            (members || []).map(m => {
                selectedCertification.push(m.id)
            })
            this.setState({
                selectedApp,
                selectedEnt,
                selectedCertification
            })
        } else {
            this.setState({
                selectedApp: [],
                selectedEnt: [],
                selectedCertification: []
            })
        }
    }

    onApproveSelected = () => {
        const {selectedApp, selectedEnt, apps, isChangeTable} = this.state;
        if (isChangeTable) {
            if (selectedApp.length) {
                selectedApp.forEach((x) => {
                    apps[x].action = apps[x].action === 'required' ? 'certified' : apps[x].action;
                });
            }
            if (selectedEnt && selectedEnt.length) {
                selectedEnt.forEach((y) => {
                    (y.entIds || []).forEach((j) => {
                        apps[y.appId].entityEntitlements[j].action = apps[y.appId].entityEntitlements[j].action === 'required' ? 'certified' : apps[y.appId].entityEntitlements[j].action;
                    })
                });
            }
            this.setState({
                apps
            }, () => this.submitData());
        }
    }

    onRevokeSelected = () => {
        const {selectedApp, selectedEnt, apps, isChangeTable} = this.state;
        if (isChangeTable) {
            if (selectedApp.length) {
                selectedApp.forEach((x) => {
                    apps[x].action = apps[x].action === 'required' ? 'rejected' : apps[x].action;
                });
            }
            if (selectedEnt && selectedEnt.length) {
                selectedEnt.forEach((y) => {
                    (y.entIds || []).forEach((j) => {
                        apps[y.appId].entityEntitlements[j].action = apps[y.appId].entityEntitlements[j].action === 'required' ? 'rejected' : apps[y.appId].entityEntitlements[j].action;
                    })
                });
            }
            this.setState({
                apps
            }, () => this.submitData());
        }
    }

    onChangeTab = (newActiveKey, isRefresh) => {
        const {certificate, activeKey} = this.state;
        if (activeKey === newActiveKey && !isRefresh) {
            return;
        }
        this.getUserDetails(newActiveKey, certificate.campaignId);
        this.setState({
            activeKey: newActiveKey,
            apps: [],
            selectedApp: [],
            selectedEnt: [],
            selectedCertification: []
        })
    }

    checkBoxChange = (id,) => {
        let {selectedApp} = this.state;
        if (selectedApp.indexOf(id) > -1) {
            selectedApp = selectedApp.filter(x => x !== id);
        } else {
            selectedApp.push(id);
        }
        this.setState({
            selectedApp
        })
    }

    certificationCheckBoxChange = (id,) => {
        let {selectedCertification} = this.state;
        if (selectedCertification.indexOf(id) > -1) {
            selectedCertification = selectedCertification.filter(x => x !== id);
        } else {
            selectedCertification.push(id);
        }
        this.setState({
            selectedCertification
        })
    }

    entCheckBoxChange = (id, appId, event) => {
        let {selectedEnt} = this.state;
        if (selectedEnt.find(x => x.appId === appId)) {
            const app = selectedEnt.find(x => x.appId === appId);
            if (event.target.checked) {
                app.entIds.push(id);
            } else {
                app.entIds = app.entIds.filter(x => x !== id);
            }
        } else if (event.target.checked) {
            const obj = {
                appId: appId,
                entIds: [id]
            };
            selectedEnt.push(obj);
        }
        this.setState({
            selectedEnt
        })
    }

    CustomExpandIcon = (props) => {
        if (props.expanded) {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
        } else {
            return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
        }
    }

    onChangeTable = (record) => {
        this.setState({
            selectedApp: [],
            selectedEnt: [],
            selectedCertification: [],
            isChangeTable: !this.state.isChangeTable,
            filter: ''
        });
        if (record && record.userInfo) {
            this.onChangeTab(record.userInfo.UserName);
        }
    }

    onBackDashboard = () => {
        const {clientId} = this.state;
        this.setState({
            selectedApp: [],
            selectedEnt: [],
            selectedCertification: [],
        }, () => this.props.history.push(`/${clientId}/certification`))
    }

    renderFilters = () => {
        return (
            <Row>
                <Col xs={12} md={12} sm={12}>
                    <Panel xs={12} md={12} sm={12} title={' Filters '}>
                        <Row>
                            <Col xs={12} md={4} sm={12}>
                                <form className="form">
                                    <div className="form__form-group">
                                        <span className="form__form-group-label"><b>User Id</b></span>
                                        <div className="form__form-group-field">
                                            <Select>
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="tom">Tom</Option>
                                            </Select>
                                        </div>
                                    </div>
                                </form>
                            </Col>
                            <Col xs={12} md={4} sm={12}>
                                <form className="form">
                                    <div className="form__form-group">
                                        <span className="form__form-group-label"><b>User First Name</b></span>
                                        <div className="form__form-group-field">
                                            <Select>
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="tom">Tom</Option>
                                            </Select>
                                        </div>
                                    </div>
                                </form>
                            </Col>
                            <Col xs={12} md={4} sm={12}>
                                <form className="form">
                                    <div className="form__form-group">
                                        <span className="form__form-group-label"><b>App Name</b></span>
                                        <div className="form__form-group-field">
                                            <Select>
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="tom">Tom</Option>
                                            </Select>
                                        </div>
                                    </div>
                                </form>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={4} sm={12}>
                                <form className="form">
                                    <div className="form__form-group">
                                        <span className="form__form-group-label"><b>Entitlement Id</b></span>
                                        <div className="form__form-group-field">
                                            <Select>
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="tom">Tom</Option>
                                            </Select>
                                        </div>
                                    </div>
                                </form>
                            </Col>
                            <Col xs={12} md={4} sm={12}>
                                <form className="form">
                                    <div className="form__form-group">
                                        <span className="form__form-group-label"><b>Smart Suggestion</b></span>
                                        <div className="form__form-group-field">
                                            <Select>
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="tom">Tom</Option>
                                            </Select>
                                        </div>
                                    </div>
                                </form>
                            </Col>
                            <Col xs={12} md={4} sm={12}>
                                <Button className="icon square mb-0 mt-25" size={"sm"} color="primary"><p>Add
                                    Filter<Icon className="ml-5" type="plus"/></p></Button>
                                <Button className="icon square mb-0 mt-25" size={"sm"} color="primary"><p>Reset</p>
                                </Button>
                            </Col>
                        </Row>
                    </Panel>
                </Col>
            </Row>
        );
    }

    getFilterEntData = (entityEntitlements) => {
        const {filter} = this.state;
        if (!filter) {
            return entityEntitlements;
        }
        let filteredData = clonedeep(entityEntitlements);
        filteredData = filteredData.filter(x => {
            return x.action.toLowerCase().includes(filter.toLowerCase());
        });
        return filteredData;
    }

    getFilterData = () => {
        const {filter, apps} = this.state;
        if (!filter) {
            return apps;
        }
        let filteredData = clonedeep(apps);
        filteredData = filteredData.filter(x => {
            return x.action === filter || (x.entityEntitlements || []).filter(y => {
                return y.action === filter;
            }).length > 0;
        });
        return filteredData;
    }

    getFilteredUsers = () => {
        const {members, searchUser} = this.state;
        if (!searchUser) {
            return members;
        }
        let filteredUserData = members || [];
        filteredUserData = filteredUserData.filter(x => {
            const name = x.userInfo && `${(x.userInfo.FirstName || '')} ${(x.userInfo.LastName || '')}`;
            return name.toLowerCase().includes(searchUser.toLowerCase());
        });
        return filteredUserData;
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    onChangeSearchUser = (event) => {
        this.setState({
            searchUser: event.target.value
        })
    }

    submitData = async () => {
        const {apps, certificate, userDetails} = this.state;
        const userName = userDetails && userDetails.userDetails && userDetails.userDetails.userInfo && userDetails.userDetails.userInfo.UserName;
        if (!certificate || !certificate.campaignId || !(apps || []).length) {
            return message.error('No change has been made!');
        }
        if (!userName) {
            return message.error('No User found!');
        }
        const objPayload = {
            userName: userName,
            campaignId: certificate.campaignId,
            entityAppinstance: []
        };
        apps.forEach(app => {
            const copiedApp = clonedeep(app);
            const changedEnt = (copiedApp.entityEntitlements || []).filter(x => x.action !== x.prevAction);
            if (copiedApp.action !== copiedApp.prevAction || changedEnt.length > 0) {
                copiedApp.entityEntitlements = changedEnt;
                objPayload.entityAppinstance.push(copiedApp);
            }
        });
        if (objPayload.entityAppinstance.length) {
            objPayload.entityAppinstance.forEach(x => {
                omit(x, ['prevAction']);
                x.entityEntitlements.forEach(y => {
                    omit(y, ['prevAction']);
                })
            });
            const data = await ApiService.certificationAction(objPayload);
            if (!data || data.error) {
                return message.error('Something is wrong! Please try again!')
            } else {
                this.onChangeTab(userName, true);
                this.setState({
                  selectedApp: [],
                  selectedEnt: [],
                });
                return message.success('Decision update successfully');
            }
        } else {
            return message.error('No change has been made!');
        }

    }

    getChangedCount = () => {
        const {apps} = this.state;
        if (!apps || apps.length === 0) {
            return 0;
        }
        let count = 0;
        apps.forEach(app => {
            if (app.action !== app.prevAction) {
                count++;
            }
            (app.entityEntitlements || []).forEach(ent => {
                if (ent.action !== ent.prevAction) {
                    count++;
                }
            })
        });
        return count;
    }

    onNextUser = () => {
      const {members, activeKey} = this.state;
      const mainRecordIndex = members.findIndex(x => x.userInfo.UserName === activeKey);
      if (mainRecordIndex < members.length - 1) {
        const nextUser = members[mainRecordIndex + 1];
        this.onChangeTab(nextUser.userInfo.UserName)
      }
    }

    onPrevUser = () => {
      const {members, activeKey} = this.state;
      const mainRecordIndex = members.findIndex(x => x.userInfo.UserName === activeKey);
      if (mainRecordIndex) {
          const prevUser = members[mainRecordIndex - 1];
          this.onChangeTab(prevUser.userInfo.UserName)
      }
    }

    render() {
        const {isChangeTable, selectedApp, selectedEnt, selectedCertification, members, searchUser, activeKey, isLoadingUser, isLoading, certificationId, campaignId, clientId} = this.state;
        const certificateInfo = (this.state.certificate || {}).reviewerCertificationInfo || {};
        const certificateActionInfo = (this.state.certificate || {}).reviewerCertificateActionInfo || {};
        const dueDays = certificateInfo.certificationExpiration ?
            moment(certificateInfo.certificationExpiration).diff(moment(), 'days') : 0;
        const changedCount = this.getChangedCount();
        const getIntials = (firstName, lastName) => {
            return `${(firstName || '').length ? firstName.substr(0, 1).toUpperCase() : ''}${(lastName || '').length ? lastName.substr(0, 1).toUpperCase() : ''}`
        };
        const mainRecord = members.find(x => x.userInfo.UserName === activeKey) || {};
        const totalCertified = (((mainRecord.numOfApplicationsCertified || 0) + (mainRecord.numOfEntitlementsCertified || 0) + (mainRecord.numOfRolesCertified || 0)));
        const totalNumber = (((mainRecord.noOfApplications || 0) + (mainRecord.noOfRoles || 0) + (mainRecord.numOfEntitlements || 0)))
        const percentage = totalNumber === 0 ? 100 : parseInt(((totalCertified || 0) * 100) / (totalNumber));
        const mainColumns = [
            {
                title: '',
                width: 80,
                render: (record) => {
                    return (
                        <div className="flex-align-center">
                            <Checkbox className="custom-check-box pl-20"
                                      checked={selectedCertification.includes(record.id) || false}
                                      onChange={() => this.certificationCheckBoxChange(record.id)}/>
                            <div className="table-initial-name ml-10" style={{background: (record.color || 'red')}}>{getIntials(record.userInfo.FirstName, record.userInfo.LastName)}</div>
                        </div>
                    )
                }
            },
            {
                title: '',
                render: (record) => {
                    return (
                        <div className="tab-area">
                            <span className='cursor-pointer' onClick={() => this.onChangeTable(record)}>
                            <div><h4>{record.userInfo.FirstName} {record.userInfo.LastName}</h4></div>
                            <div><b>Email</b>: {record.userInfo.Email}</div>
                            <div>{record.userInfo.Mobile ? `${record.userInfo.Mobile} (M)` : ''}</div>
                                </span>
                        </div>
                    );
                }
            },
            {
                title: '',
                render: (record) => {
                    return (
                        <div>
                            <div><b>Roles</b>: {record.noOfRoles}</div>
                            <div>Application: <b>{record.noOfApplications}</b></div>
                            <div>Entitlement: <b>{record.numOfEntitlements}</b></div>
                        </div>
                    );
                }
            },
          {
            title: '',
            render: (record) => {
              return (
                <div className="text-center">
                    <div className="text-center"><b>0</b></div>
                    <div className="text-center">Risk Score</div>
                </div>
              );
            }
          },
          {
            title: '',
            render: (record) => {
              const sum = (record.noOfApplications || 0) + (record.numOfEntitlements || 0) + (record.noOfRoles || 0);
              let appPercent = 0;
              let entPercent = 0;
              let rolePercent = 0;
              if (sum > 0) {
                appPercent = parseInt(((record.noOfApplications || 0) * 100) / sum);
                entPercent = parseInt(((record.numOfEntitlements || 0) * 100) / sum);
                rolePercent = parseInt(((record.noOfRoles || 0) * 100) / sum);
              }
              return <div className="text-center">
                  <ul className="riskbar">
                      <li>
                          <span className="bg-danger" style={{height: `${appPercent}%`}}/>
                      </li>
                      <li>
                          <span className="bg-warning" style={{height: `${entPercent}%`}}/>
                      </li>
                      <li>
                          <span className="bg-success" style={{height: `${rolePercent}%`}}/>
                      </li>
                  </ul>
                  <ul className="riskbar2">
                      <li>{record.noOfApplications || 0}</li>
                      <li>{record.numOfEntitlements || 0}</li>
                      <li>{record.noOfRoles || 0}</li>
                  </ul>
                  <div className="text-risk"> Risk Items</div>
              </div>
            }
           },
            {
                render: (record) => {
                    const totalCertified = (record.numOfApplicationsCertified + record.numOfEntitlementsCertified + record.numOfRolesCertified) * 100;
                    const totalNumber = (record.noOfApplications + record.noOfRoles + record.numOfEntitlements);
                    const percentage = totalNumber === 0 ? 100 : (totalCertified) / (totalNumber);
                    return <div className="text-center"><Progress type="circle" width={100}
                                                                  percent={parseInt(percentage || 0)}/>
                    </div>;
                }
            },
            {
                render: (record) => {
                    return <div className="text-center"><Icon type="right" onClick={() => this.onChangeTable(record)}/>
                    </div>;
                }
            }
        ];
        return (
            <div>
                <CustomHeader title={<span className="app-title-icon-and-app-title"><span className="app-title-icon"><img src={require('../../shared/img/appIcon.png')} /></span> {certificateInfo.certificationName || '-'}</span>}/>
                <div className="user-detail-page">
                    { isChangeTable ?
                        <div className="custom-side-bar">
                            <div className="user-search">
                                <Search
                                    size="small"
                                    placeholder="Search Name"
                                    value={searchUser}
                                    onChange={this.onChangeSearchUser}
                                />
                            </div>
                            <div className="inner-profile">
                            <Icon type="left" onClick={this.onPrevUser} className="profile-nav-arrow" />
                            <Icon type="right" onClick={this.onNextUser} className="profile-nav-arrow right-arrow" />
                                <div className="text-center ">
                                    <div className="initial-name-inner-profile"
                                         style={{background: mainRecord && mainRecord.color || 'red'}}>{(mainRecord && mainRecord.userInfo && mainRecord.userInfo.FirstName || 'A').substr(0, 1)}{(mainRecord && mainRecord.userInfo && mainRecord.userInfo.LastName || 'B').substr(0, 1)}</div>
                                    <div
                                        className="UName">{mainRecord && mainRecord.userInfo && mainRecord.userInfo.FirstName} {mainRecord && mainRecord.userInfo && mainRecord.userInfo.LastName}</div>
                                    <div
                                        className="UDesignation">{mainRecord && mainRecord.userInfo && mainRecord.userInfo.Title}</div>
                                    <div
                                        className="UDesignation mb-10">{mainRecord && mainRecord.userInfo && mainRecord.userInfo.Email}</div>
                                    <div className="box-part-a">
                                        {/*<div>
                                            <span>Manager: </span><b>{mainRecord && mainRecord.userInfo && mainRecord.userInfo.Manager}</b>
                                        </div>*/}
                                        <div>
                                            <span>Department: </span><b>{mainRecord && mainRecord.userInfo && mainRecord.userInfo.Department}</b>
                                        </div>
                                        <div>
                                            <span>Hire Date: </span><b></b>
                                        </div>
                                    </div>
                                    <div className="box-part-a">
                                        <div><span>Roles: </span><b>{mainRecord && mainRecord.noOfRoles}</b>
                                        </div>
                                        <div>
                                            <span>Applications: </span><b>{mainRecord && mainRecord.noOfApplications}</b>
                                        </div>
                                        <div>
                                            <span>Entitlements: </span><b>{mainRecord && mainRecord.numOfEntitlements}</b>
                                        </div>
                                    </div>
                                    <div className="box-part-b text-center">
                                        <Progress type="circle" width={50} percent={parseInt(percentage)}/>
                                    </div>
                                </div>
                            </div>
                         <div>
                             {
                               (this.getFilteredUsers() || []).length ?
                                  <Tabs activeKey={activeKey} tabPosition={"right"} className='custom-font-size mt-20 user-tab-list'
                                         onChange={this.onChangeTab}>
                                     {
                                       (this.getFilteredUsers() || []).map((item) => {
                                         return (
                                           <TabPane tab={
                                               <div className="user-list-item">
                                                   <span className="initialName mr-10" style={{background: item.color || 'red'}}>
                                                       {getIntials(item.userInfo.FirstName, item.userInfo.LastName)}
                                                   </span>
                                                   <span className="initial-name">
                                                   {item.userInfo.FirstName}{' '}{item.userInfo.LastName}
                                                   </span>
                                               </div>
                                               } key={item.userInfo.UserName} type="card">
                                           </TabPane>
                                         )
                                       })
                                     }
                                   </Tabs> :
                                   <div className="no-user-found">
                                       No Users Found
                                   </div>
                               }
                         </div>
                    </div> : null
                    }
                    <div className="dashboard">
                        {this.modal()}
                        {this.drawer()}
                        {this.infoModal()}
                        {this.commentModal()}
                        <Row>
                            <Col md={6} sm={12} xs={12} className="dashboard-card pr-0">
                                <div className="d-card-detail bdr-left-none">
                                    <h4 className="text-center mb-10">Certification Progress</h4>
                                    <Progress percent={certificateActionInfo.percentageCompleted || 0}/>
                                </div>
                            </Col>
                            <Col md={6} sm={12} xs={12} className="dashboard-card pl-0">
                                <div className="d-card-detail">
                                    <h4 className="text-center mb-15">Due Days</h4>
                                    <Progress min={0} max={100} strokeColor={getDueColor(dueDays)} percent={dueDays} format={() => <span>{dueDays} Days left</span>}/>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="pt-10">
                                <Breadcrumb separator=">" className='cursor-pointer'>
                                    <Breadcrumb.Item onClick={this.onBackDashboard}>Certification</Breadcrumb.Item>
                                    {!isChangeTable ? <Breadcrumb.Item>Users</Breadcrumb.Item> :
                                        <Breadcrumb.Item onClick={this.onChangeTable}>Users</Breadcrumb.Item>}
                                    {isChangeTable && <Breadcrumb.Item>Applications and Entitilements</Breadcrumb.Item>}
                                </Breadcrumb>
                            </Col>
                        </Row>
                        {
                            !isChangeTable ?
                                <Card className="mt-10">
                                    <CardHeader className="pl-20">
                                        <Row className="top-filter">
                                            <Col md={12} sm={12} xs={12} style={{paddingRight: 0}}>
                                                {
                                                    isChangeTable &&
                                                    <Search
                                                        size="large"
                                                        placeholder="Search Name"
                                                        style={{width: 220, marginRight: 130}}
                                                        value={searchUser}
                                                        onChange={this.onChangeSearchUser}
                                                    />
                                                }
                                                <Button className="square" size={"large"} color="primary">
                                                    <Checkbox
                                                        onChange={this.onSelectAll} className="custom-check-box   "
                                                        checked={!!(selectedApp.length && selectedEnt.length || selectedCertification.length === members.length)}
                                                    >Select All</Checkbox></Button>
                                                <Button className="square ml-10" size={"large"} color="primary"
                                                        onClick={() => this.onUserAction('certified')}><Icon type="check"/>Complete</Button>
                                                <Button className="square ml-10" size={"large"} color="primary"
                                                        onClick={() => this.onUserAction('rejected')}><Icon
                                                    type="minus-circle"/>Revoke</Button>
                                                    <XLSXDownloadButton
                                                        certificationId={certificationId}
                                                        history={this.props.history} campaignId={campaignId} clientId={clientId}/>
                                                {/*<Button className="square ml-10" size={"large"} color="primary"><Icon*/}
                                                    {/*type="right-circle"/>Reassign</Button>*/}
                                                {
                                                    isChangeTable ?
                                                        <Select placeholder='Filter' className='border-0 ml-10' size="small"
                                                                onChange={(value) => this.onChange({
                                                                    target: {
                                                                        name: 'filter',
                                                                        value
                                                                    }
                                                                })} style={{width: 220}}>
                                                            <Option value="">All</Option>
                                                            <Option value="certified">Approved</Option>
                                                            <Option value="rejected">Revoked</Option>
                                                            <Option value="required">Undecided</Option>
                                                        </Select> :
                                                        <Search
                                                            size="small" className="ml-10 pull-right"
                                                            placeholder="Search Name"
                                                            style={{width: 500}}
                                                            value={searchUser}
                                                            onChange={this.onChangeSearchUser}
                                                        />
                                                }
                                                {/* {
                                !isChangeTable ?  <Button size={"large"} className="ml-10" color="primary" onClick={this.onBackDashboard}>
                                    <Icon type="left-square" theme="filled" />
                                </Button> :  <Button size={"large"} className="ml-10" color="primary" onClick={this.onChangeTable}>
                                    <Icon type="left-square" theme="filled" />
                                </Button>
                              }*/}
                                                {
                                                    isChangeTable &&
                                                    <Select placeholder='' defaultValue=""
                                                            className='border-0 ml-10 float-right mr-15' size="small"
                                                            style={{width: 220}}>
                                                        <Option value="">Show New Access</Option>
                                                        <Option value="1">Show All Access</Option>
                                                    </Select>
                                                }
                                            </Col>
                                        </Row>
                                    </CardHeader>
                                    <CardBody className="pt-0">
                                        <Row>
                                            <Col className=''>
                                                {
                                                    isLoading ? <Spin className="mt-50 custom-loading"/> :
                                                        <div>
                                                            <Table
                                                                columns={mainColumns}
                                                                size="small"
                                                                className="main-table"
                                                                showHeader={false}
                                                                dataSource={this.getFilteredUsers()}
                                                                onRow={(record, rowIndex) => {
                                                                    return {
                                                                        className: selectedCertification.includes(record.id) ? "row-selected" : ''
                                                                    };
                                                                }}
                                                            />

                                                        </div>

                                                }
                                            </Col>
                                        </Row>
                                        {
                                            this.state.isChangeTable &&
                                            <div className="sticky-btn">
                                                <Button
                                                    className="icon square float-right mb-0"
                                                    size={"large"} color="primary"
                                                    disabled={changedCount === 0}
                                                    onClick={this.submitData}>
                                                    Save & Review Later ({changedCount})
                                                </Button>
                                            </div>
                                        }
                                    </CardBody>
                                </Card> :
                                <ApplicationAndEntitlements
                                    getFilteredUsers={this.getFilteredUsers}
                                    members={members}
                                    activeKey={activeKey}
                                    onChangeTab={this.onChangeTab}
                                    getIntiials={getIntials}
                                    entCheckBoxChange={this.entCheckBoxChange}
                                    showDrawer={this.showDrawer}
                                    undoDecisionEnt={this.undoDecisionEnt}
                                    onUpdateEntStatus={this.onUpdateEntStatus}
                                    onToggleComment={this.onToggleComment}
                                    getFilterEntData={this.getFilterEntData}
                                    checkBoxChange={this.checkBoxChange}
                                    showInfoDrawer={this.showInfoDrawer}
                                    undoDecisionApp={this.undoDecisionApp}
                                    onUpdateAppStatus={this.onUpdateAppStatus}
                                    CustomExpandIcon={this.CustomExpandIcon}
                                    isLoadingUser={isLoadingUser}
                                    selectedEnt={selectedEnt}
                                    selectedApp={selectedApp}
                                    changedCount={changedCount}
                                    getFilterData={this.getFilterData}
                                    searchUser={searchUser}
                                    selectedCertification={selectedCertification}
                                    onChangeSearchUser={this.onChangeSearchUser}
                                    onSelectAll={this.onSelectAll}
                                    confirmApproveSelected={this.confirmApproveSelected}
                                    onUserAction={this.onUserAction}
                                    confirmRevokeSelected={this.confirmRevokeSelected}
                                    onChange={this.onChange}
                                    submitData={this.submitData}
                                />
                        }

                    </div>
                </div>
            </div>
        )
    }
}

export default HomePage;
