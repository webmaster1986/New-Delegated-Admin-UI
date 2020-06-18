import React, {Component} from 'react';
import {Col, Row} from 'reactstrap';
import clonedeep from "lodash.clonedeep";
import {omit, get} from "lodash";
import {
    Icon, Modal, Drawer, Checkbox, Slider, Input, message, Progress,
    Tabs, Button, Breadcrumb, Radio
} from 'antd';

const {TextArea} = Input;
const {TabPane} = Tabs;
import '../Home/Home.scss';
import './CertificaitonOwner.scss';
import {ApiService} from "../../services/ApiService";
import moment from "moment";
import { getDueColor } from '../../services/constants';

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

const cookies = new Cookies();
const getUserName = () => {
    return cookies.get('LOGGEDIN_USERID');
}

class AppOwnerCertification extends Component {
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
            isLoading: true,
            isLoadingUser: false,
            isApplicationApprove: false,
            isChangeTable: false,
            bulkDecisions: '',
            columns: '',
            groupBy: 'users',
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
            campaignId: '',

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
            const firstUserName = members.length > 0 ? members[0].userInfo.UserName : '';
            this.setState({
                certificate: data,
                activeKey: firstUserName,
                members,
                campaignId: data.campaignId,
                isLoading: false,
            });
            if (firstUserName) {
              this.getUserDetails(firstUserName, data.campaignId);
            }
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

    onToggleComment = (entId, text) => {
        this.setState({
            isComment: !this.state.isComment,
            comment: {
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
        apps[comment.entId].entInfo.newComment = comment.text;
        this.setState({
            apps,
            isComment: false,
            comment: {
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
            const newApps = [];
            let id = 0;
            apps.forEach((app, index) => {
              app.prevAction = app.action ? app.action : 'required';
              app.appId = index;
              app.action = app.action ? app.action : 'required';
              
              (app.entityEntitlements || []).forEach((ent) => {
                ent.prevAction = ent.action ? ent.action : 'required';
                ent.action = ent.action ? ent.action : 'required';
                newApps.push({
                  ...app,
                  entId: id,
                  entInfo: {
                    ...ent
                  },
                });
                id++;
              });
            });
            this.setState({
                userDetails: data,
                apps: newApps,
                backApps: apps,
                isLoadingUser: false,
                isLoading: false,
            });
        }
    }

    onUpdateEntStatus = (index, action) => {
        const {apps} = this.state;
        const currentAction = apps[index].entInfo.action;
        apps[index].entInfo.action = (currentAction === action ? 'required' : action);
        this.setState({
            apps
        });
    }

    undoDecisionEnt = (entId) => {
        const {apps} = this.state;
        if (apps[entId] && apps[entId].entInfo) {
            apps[entId].entInfo.action = apps[entId].entInfo.prevAction;
        }
        this.setState({
            apps
        });
    }

    confirmApproveSelected = () => {
        const {selectedEnt} = this.state;
        if (selectedEnt.length) {
            this.onApproveSelected();
        }
    }

    confirmRevokeSelected = () => {
        const {selectedEnt} = this.state;
        if (selectedEnt.length) {
            this.onRevokeSelected();
        }
    }

    onSelectAll = (e) => {
        let {apps, selectedEnt} = this.state;
        if (e.target.checked) {
            selectedEnt = apps.map(x => x.entId);
            this.setState({
                selectedEnt,
            })
        } else {
            this.setState({
                selectedEnt: [],
            })
        }
    }

    onApproveSelected = () => {
        const {selectedEnt, apps} = this.state;
        if (selectedEnt.length) {
            selectedEnt.forEach((x) => {
              apps[x].entInfo.action = apps[x].entInfo.action === 'required' ? 'certified' : apps[x].entInfo.action;
            });
        }
        this.setState({
            apps
        }, () => this.submitData());
    }

    onRevokeSelected = () => {
        const {selectedEnt, apps} = this.state;
        if (selectedEnt.length) {
          selectedEnt.forEach((x) => {
              apps[x].entInfo.action = apps[x].entInfo.action === 'required' ? 'rejected' : apps[x].entInfo.action;
          });
        }
        this.setState({
            apps
        }, () => this.submitData());
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
            selectedEnt: [],
            selectedCertification: []
        })
    }

    entCheckBoxChange = (id, event) => {
        let {selectedEnt} = this.state;
        if (event.target.checked && !selectedEnt.includes(id)) {
            selectedEnt.push(id);
        } else {
          selectedEnt = selectedEnt.filter(x => x !== id);
        }
        this.setState({
            selectedEnt
        })
    }

    onBackDashboard = () => {
        const {clientId} = this.state;
        this.setState({
            selectedEnt: [],
            selectedCertification: [],
        }, () => this.props.history.push(`/${clientId}/certification`))
    }

    getFilterData = () => {
        const {filter, apps} = this.state;
        if (!filter) {
            return apps;
        }
        let filteredData = clonedeep(apps);
        filteredData = filteredData.filter(x => {
            return x.entInfo.action === filter;
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
        if (!certificate || !certificate.campaignId || !apps.length) {
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
            if (app.entInfo.action !== app.entInfo.prevAction) {
                objPayload.entityAppinstance.push(app);
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
        return apps.filter(app => {
            return get(app, 'entInfo.action') !== get(app, 'entInfo.prevAction')
        }).length;
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
        const {selectedEnt, members, searchUser, activeKey, isLoadingUser, isLoading, apps, groupBy} = this.state;
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
        if (isLoading) {
            return <div>Loading........</div>
        }
        return (
            <div>
                <CustomHeader title={<span className="app-title-icon-and-app-title"><span className="app-title-icon"><img src={require('../../shared/img/appIcon.png')} /></span> {certificateInfo.certificationName || '-'}</span>}/>
                <div className="user-detail-page">
                    <div className="custom-side-bar">
                            <div className="user-search pb-0">
                                <div className="color-white">Group By</div>
                                <div>
                                    <Radio.Group className="color-white" name="groupBy" onChange={this.onChange} value={groupBy}>
                                        <Radio value={'users'}>Users</Radio>
                                        <Radio value={'entitlemnts'}>Entitlemnts</Radio>
                                    </Radio.Group>
                                </div>
                            </div>
                            <div className="user-search">
                                <Search
                                    size="small"
                                    placeholder="Search Name"
                                    className="h-30"
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
                                        <div>
                                            <span>Department: </span><b>{mainRecord && mainRecord.userInfo && mainRecord.userInfo.Department}</b>
                                        </div>
                                        <div>
                                            <span>Hire Date: </span><b></b>
                                        </div>
                                    </div>
                                    <div className="box-part-a overflow-auto">
                                        <div className="float-left">
                                            <div><span>Applications: </span><b>{mainRecord && mainRecord.noOfApplications}</b></div>
                                            <div><span>Entitlements: </span><b>{mainRecord && mainRecord.numOfEntitlements}</b></div>
                                        </div>
                                        <div className="float-right">
                                            <Progress type="circle" width={50} percent={parseInt(percentage)}/>
                                        </div>
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
                    </div>
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
                                    <Breadcrumb.Item>Applications and Entitilements</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <ApplicationAndEntitlements
                                    members={members}
                                    apps={apps}
                                    activeKey={activeKey}
                                    onChangeTab={this.onChangeTab}
                                    getIntiials={getIntials}
                                    entCheckBoxChange={this.entCheckBoxChange}
                                    showDrawer={this.showDrawer}
                                    undoDecisionEnt={this.undoDecisionEnt}
                                    onUpdateEntStatus={this.onUpdateEntStatus}
                                    onToggleComment={this.onToggleComment}
                                    showInfoDrawer={this.showInfoDrawer}
                                    isLoadingUser={isLoadingUser}
                                    selectedEnt={selectedEnt}
                                    changedCount={changedCount}
                                    getFilterData={this.getFilterData}
                                    onSelectAll={this.onSelectAll}
                                    confirmApproveSelected={this.confirmApproveSelected}
                                    confirmRevokeSelected={this.confirmRevokeSelected}
                                    onChange={this.onChange}
                                    submitData={this.submitData}
                                />
                    </div>
                </div>
            </div>
        )
    }
}

export default AppOwnerCertification;
