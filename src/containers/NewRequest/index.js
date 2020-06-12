import React, {Component} from 'react';
import {Icon, Input, Tabs, Radio, Spin, message, Modal, Button, DatePicker} from 'antd';
import {get} from 'lodash';
const {TabPane} = Tabs;
import '../Home/Home.scss';
import {ApiService} from "../../services/ApiService";

const {Search} = Input;
const {TextArea} = Input;

const colors = ['red', 'green', 'black', 'violet', '#a2a25d'];

const getColor = (index) => {
    const i = index % 5;
    return colors[i] ? colors[i] : colors[0];
}

import RequestList from "./RequestList";
import CustomHeader from "../Layout/CustomHeader";
import clonedeep from "lodash.clonedeep";
import Cookies from "universal-cookie";
import {Col, Row} from "reactstrap";


const cookies = new Cookies();
const getUserName = () => {
    return cookies.get('LOGGEDIN_USERID');
}

const initialState = {
    isLoading: false,
    isComment: false,
    isSidebarLoading: false,
    members: [],
    apps: [],
    selectedEnt: [],
    isBeneficiaryInfo: false,
    beneficiaryInfo: {},
    comment: {
        id: '',
        text:  '',
    }
}

class Request extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            groupBy: "users",
            isSidebar: true,
            activeKey: "",
            loggedUser: {},
            filter: "Add",
            ...initialState
        };
    }

    componentDidMount() {
        this.getLoggedInUserDetails()
    }

    getLoggedInUserDetails = async () => {
        this.setState({
            isLoading: true
        })

        const payload = {
            userName: getUserName(),
            managerRequired:""
        }

        const data = await ApiService.getUsersWorkflow(payload)
        if(!data || data.error){
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            if(data && data.length){
                this.setState({
                    loggedUser: data[0]
                }, () => this.getRequests(this.state.groupBy))
            }
        }

    }

    getRequests = async (key) => {
        if (!key) {
            key = 'users';
        }
        const { loggedUser } = this.state
        this.setState({
            isLoading: true,
            isSidebarLoading: true,
            selectedRequests: [],
        });
        const members = []

        const payload = {
            managerID: loggedUser.id
        }
        let data = await this._apiService.getRequests(payload);
        if(!data || data.error){
            this.setState({
                isLoading: false,
                isSidebarLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            data = (data || []).map(x => {
                return {
                    ...x,
                    entityID: x.entity.entityID,
                    entityName: x.entity.entityName,
                    entityType: x.entity.entityType,
                    dummyId: 108,
                    action: x.status && x.status !== 'Submitted' ? x.status : 'Add'
                }
            });
            (data || []).forEach(obj => {
                if(key === "request") {
                    if (!((members || []).some(mem => mem.name === obj.dummyId))) {
                        members.push({
                            name: obj.dummyId,
                            displayName: obj.requestName || "Request",
                            id: (members.length + 1),
                            color: getColor(members.length)
                        })
                    }
                } else {
                    if (key === "entity"){
                        if(!((members || []).some(mem => mem.name === obj.entityID))){
                            members.push({
                                name: obj.entityID,
                                displayName: obj.entityName,
                                type: obj.entityType,
                                id: (members.length + 1),
                                color: getColor(members.length)
                            })
                        }
                    } else {
                        if(!((members || []).some(mem => mem.name === obj.requestedForID))){
                            members.push({
                                name: obj.requestedForID,
                                displayName: obj.requestedForDisplayName || "Request",
                                id: (members.length + 1),
                                color: getColor(members.length)
                            })
                        }
                    }
                }
            });
            let firstUserName = this.state.activeKey || (members.length > 0 ? members[0].name : '');
            this.setState({
                data,
                isLoading: false,
                isSidebarLoading: false,
                activeKey: firstUserName,
                members
            });
            if(firstUserName){
                this.getUserDetails(firstUserName)
            }
        }
    }

    getUserDetails = async (value) => {
        const { data, groupBy } = this.state
        this.setState({
            isLoadingUser: true
        });
        let keyFilter = groupBy === 'request' ? 'dummyId' : groupBy === 'entity' ? 'entityID' : 'requestedForID';
        const newApps = [];
        data.filter(x => x[keyFilter] === value).forEach((obj) => {
            obj.prevAction = obj.action ? obj.action : 'Add';
            obj.action = obj.action ? obj.action : 'Add';
            newApps.push(obj);
        });
        this.setState({
            apps: newApps,
            isLoadingUser: false,
            isLoading: false,
        });
    }

    onChange = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value,
            activeKey: name === "groupBy" ? "" : this.state.activeKey
        }, () => {
            if(name === "groupBy"){
                this.getRequests(value)
            }
        })
    }

    getFilteredUsers = () => {
        const {members, searchUser} = this.state;
        if (!searchUser) {
            return members;
        }
        let filteredUserData = members || [];
        filteredUserData = filteredUserData.filter(x => {
            // const name = x.userInfo && `${(x.userInfo.FirstName || '')} ${(x.userInfo.LastName || '')}`;
            const name = x && x.displayName;
            return name.toLowerCase().includes(searchUser.toLowerCase());
        });
        return filteredUserData;
    }

    getChangedCount = () => {
        const {apps} = this.state;
        if (!apps || apps.length === 0) {
            return 0;
        }
        return apps.filter(app => {
            return get(app, 'action') !== get(app, 'prevAction')
        }).length;
    }

    getFilterData = () => {
        const {filter, searchKey, apps} = this.state;
        if (!filter && !searchKey) {
            return apps;
        }

        let filteredData = clonedeep(apps);

        if(filter){
            filteredData = (filteredData || []).filter(x => {
                return x.prevAction === filter;
            });
        }
        return filteredData;
    }

    onNextUser = () => {
        const {members, activeKey} = this.state;
        const mainRecordIndex = members.findIndex(x => x.name === activeKey);
        if (mainRecordIndex < members.length - 1) {
            const nextUser = members[mainRecordIndex + 1];
            this.onChangeTab(nextUser.name)
        }
    }

    onPrevUser = () => {
        const {members, activeKey} = this.state;
        const mainRecordIndex = members.findIndex(x => x.name === activeKey);
        if (mainRecordIndex) {
            const prevUser = members[mainRecordIndex - 1];
            this.onChangeTab(prevUser.name)
        }
    }

    onChangeTab = (newActiveKey, isRefresh) => {
        const {activeKey, groupBy} = this.state;
        if (activeKey === newActiveKey && !isRefresh) {
            return;
        }
        this.getUserDetails(newActiveKey, groupBy);
        this.setState({
            activeKey: newActiveKey,
            // apps: [],
            selectedEnt: [],
            selectedCertification: []
        })
    }

    onUpdateEntStatus = (id, action, isConfirmation) => {
        const {apps} = this.state;
        const that = this
        const index = (apps || []).findIndex(app => app.id === id)
        if(index !== -1){
            apps[index].action = (apps[index].action === action ? 'Add' : action);
        }

        if(isConfirmation){
            Modal.confirm({
                title: 'SOD violation',
                content: (
                  <Row>
                      <Col md={12}>
                          <label>Comment</label>
                          <TextArea
                            placeholder="Write here..."
                            autosize={{minRows: 2, maxRows: 6}}
                          />
                      </Col>
                      <Col className="mt-10" md={12} sm={12} xs={12}>
                          <label>End Date</label>
                          <DatePicker name="endDate" format={'YYYY/MM/DD'} style={{width: '100%'}} onChange={(date, dateString) => {}} required/>
                      </Col>
                  </Row>
                ),
                okText: 'Submit',
                cancelText: 'Cancel',
                onOk() {
                    that.setState({apps});
                }
            });
        }else {
            this.setState({
                apps
            });
        }
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

    onSelectAll = (e) => {
        let {apps, selectedEnt} = this.state;
        if (e.target.checked) {
            selectedEnt = apps.map((x) => x.id);
            this.setState({
                selectedEnt,
            })
        } else {
            this.setState({
                selectedEnt: [],
            })
        }
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

    onApproveSelected = () => {
        const {selectedEnt, apps} = this.state;
        if (selectedEnt.length) {
            selectedEnt.forEach((x) => {
                const appIndex = apps.findIndex(y => y.id === x);
                if (appIndex > -1) {
                    apps[appIndex].action = apps[appIndex].action === 'Add' ? 'Approved' : apps[appIndex].action;
                }
            });
        }
        this.setState({
            apps
        },() => this.submitData());
    }

    onRevokeSelected = () => {
        const {selectedEnt, apps} = this.state;
        if (selectedEnt.length) {
            selectedEnt.forEach((x) => {
                const appIndex = apps.findIndex(y => y.id === x);
                if (appIndex > -1) {
                    apps[appIndex].action = apps[appIndex].action === 'Add' ? 'Rejected' : apps[appIndex].action;
                }
            });
        }
        this.setState({
            apps
        },() => this.submitData());
    }

    onSaveComment = () => {
        const {comment, apps} = this.state;
        const index = apps.findIndex(art => art.id === comment.id);
        if(index !== -1){
            apps[index].comments = comment.text;
        }
        this.setState({
            apps,
            isComment: false,
            comment: {
                id: '',
                text:  '',
            }
        })
    }

    onToggleComment = (id, text) => {
        this.setState({
            isComment: !this.state.isComment,
            comment: {
                id,
                text: text || '',
            }
        });
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

    onToggleBeneficiaryInfo = (record) => {
        this.setState({
            isBeneficiaryInfo: !this.state.isBeneficiaryInfo,
            beneficiaryInfo: !this.state.isBeneficiaryInfo ? record : {}
        });
    }

    beneficiaryInfoModal = () => {
        const {isBeneficiaryInfo, beneficiaryInfo} = this.state;
        return (
          <Modal
            width={400}
            onCancel={this.onToggleBeneficiaryInfo}
            visible={isBeneficiaryInfo}
            footer={
                <div>
                    <Button  onClick={this.onToggleBeneficiaryInfo}>Close</Button>
                </div>
            }
          >
              <div className="mr-15 mt-10">
                  <h5 className="mt-5"><b>User Email: </b>{beneficiaryInfo.requestedForEmail || ""}</h5>
                  <h5 className="mt-7"><b>Dept: </b>{beneficiaryInfo.requestedForEmail || ""}</h5>
                  <h5 className="mt-5"><b>Job Code: </b>{beneficiaryInfo.requestedForEmail || ""}</h5>
              </div>
          </Modal>
        )
    }

    onCancelComment = () => {
        this.setState({
            isComment: false,
            comment: {
                id: '',
                text:  '',
            }
        })
    }

    onChangeComment = (event) => {
        const {comment} = this.state;
        comment.text = event.target.value;
        this.setState({
            comment
        })
    }

    submitData = async () => {
        const {apps} = this.state;
        const requestObj = [];
        apps.forEach(x => {
            if (x.action !== x.prevAction) {
                requestObj.push({
                    id: x.id,
                    status: x.action === 'Approved',
                    comments: x.comments
                });
            }

        });

        if (requestObj.length) {
            try {
                await ApiService.submitRequestAction(requestObj);
                message.success('Actions submitted successfully!');
                this.setState({
                    ...initialState,
                });
                this.getRequests(this.state.groupBy)
            }  catch {
                message.error('something went wrong! please try again later');
            }
        }
    }

    render() {
        const {members, searchUser, activeKey, groupBy, isLoading, isSidebarLoading, apps, filter, isLoadingUser, selectedEnt, searchKey, isSidebar} = this.state;
        const changedCount = this.getChangedCount();
        const getIntials = (firstName, lastName) => {
            return `${(firstName || '').length ? firstName.substr(0, 1).toUpperCase() : ''}${(lastName || '').length ? lastName.substr(0, 1).toUpperCase() : ''}`
        };
        const mainRecord = members.find(x => x.name === activeKey) || {};

        const selectedRecord = (apps || []).find(app => app[groupBy === "users" ? "requestedForID" : "parentReqid"] === mainRecord.name) || {}

        return (
            <div>
                <CustomHeader title={<span className="app-title-icon-and-app-title"><span className="app-title-icon"><img src={require('../../shared/img/certicon.png')} /></span>Approve Access</span>}/>
                <div className="user-detail-page">
                    {this.commentModal()}
                    {this.beneficiaryInfoModal()}
                    { groupBy !== "request" && !isSidebar ?
                        <div className="text-right color-white mt-50">
                            <Icon type="right" className="fs-30 cursor-pointer color-black"
                                  onClick={() => this.setState({isSidebar: true})}/>
                        </div> : null
                    }
                    { groupBy !== "request" && isSidebar ?
                        <div className="custom-side-bar">
                            <div className="text-right color-white mr-15">
                                <Icon type="close" className="fs-20 cursor-pointer" onClick={() => this.setState({isSidebar: !this.state.isSidebar})}/>
                            </div>
                            {/*<div className="user-search pb-0">
                            <div className="color-white">Group By</div>
                            <div>
                                <Radio.Group className="color-white" name="groupBy" onChange={this.onChange} value={groupBy}>
                                    <Radio value={'users'} className="color-white">Users</Radio>
                                    <Radio value={'entity'} className="color-white">Entity</Radio>
                                    <Radio value={'request'} className="color-white">Request Name</Radio>
                                </Radio.Group>
                            </div>
                        </div>*/}
                            <div className="user-search">
                                <Search
                                    size="small"
                                    placeholder="Search Name"
                                    name="searchUser"
                                    value={searchUser}
                                    onChange={this.onChange}
                                />
                            </div>
                            {
                                isSidebarLoading ?
                                    <div className="text-center"><Spin className='mt-50'/></div> :
                                    <div className="inner-profile">
                                        <Icon type="left" onClick={this.onPrevUser} className="profile-nav-arrow"/>
                                        <Icon type="right" onClick={this.onNextUser}
                                              className="profile-nav-arrow right-arrow"/>
                                        <div className="text-center overflow-hidden">
                                            <div className="initial-name-inner-profile"
                                                 style={{background: mainRecord && mainRecord.color || 'red'}}>{(mainRecord.displayName && mainRecord.displayName.charAt(0).toUpperCase() || 'A')}{(mainRecord.displayName && mainRecord.displayName.charAt(1).toUpperCase() || 'B')}</div>
                                            <div className="UDesignation">{mainRecord.displayName}</div>
                                            {groupBy === "users" ? <div className="UDesignation">
                                                <b>{(selectedRecord && selectedRecord.requestedForEmail) || ""}</b>
                                            </div> : null}
                                            {groupBy === "request" ? <div className="UDesignation">
                                                <span>Request Id: </span><b>{(selectedRecord && selectedRecord.parentReqid) || ""}</b>
                                            </div> : null}
                                            {groupBy === "entity" ? <div className="UDesignation">
                                                <span>Type: </span><b>{(mainRecord && mainRecord.type) || ""}</b>
                                            </div> : null}
                                            {groupBy === "request" ?
                                                <div className="box-part-a">
                                                    <div>
                                                        <span>Requested By: </span><b>{(selectedRecord && selectedRecord.requestedBy) || ""}</b>
                                                    </div>
                                                    <div>
                                                        <span>Requested On: </span><b>{(selectedRecord && selectedRecord.requestedOn) || ""}</b>
                                                    </div>
                                                </div> : null
                                            }

                                        </div>
                                    </div>
                            }

                            <div>
                                {
                                    (this.getFilteredUsers() || []).length && !isSidebarLoading ?
                                        <Tabs activeKey={activeKey} tabPosition={"right"}
                                              className='custom-font-size mt-20 user-tab-list'
                                              onChange={this.onChangeTab}>
                                            {
                                                (this.getFilteredUsers() || []).map((item) => {
                                                    return (
                                                        <TabPane tab={
                                                            <div className="user-list-item">
                                                   <span className="initialName mr-10"
                                                         style={{background: item.color || 'red'}}>
                                                       {getIntials(item.displayName && item.displayName.charAt(0), item.displayName && item.displayName.charAt(1))}
                                                   </span>
                                                                <span className="initial-name">
                                                   {item.displayName}
                                                   </span>
                                                            </div>
                                                        } key={item.name} type="card">
                                                        </TabPane>
                                                    )
                                                })
                                            }
                                        </Tabs> :
                                        <div className="no-user-found text-center color-white mt-5">
                                            {!isLoading && "No Users Found"}
                                        </div>
                                }
                            </div>
                        </div> : null
                    }
                    <div className="dashboard overflow">
                        {
                            isLoading ?
                                <Spin className='custom-loading mt-50'/> :
                                <RequestList
                                    members={members || []}
                                    apps={apps || []}
                                    selectedEnt={selectedEnt || []}
                                    activeKey={activeKey}
                                    filter={filter}
                                    isLoadingUser={isLoadingUser}
                                    changedCount={changedCount}
                                    groupBy={groupBy}
                                    searchKey={searchKey || ""}
                                    onChangeTab={this.onChangeTab}
                                    entCheckBoxChange={this.entCheckBoxChange}
                                    onUpdateEntStatus={this.onUpdateEntStatus}
                                    onToggleComment={this.onToggleComment}
                                    onToggleBeneficiaryInfo={this.onToggleBeneficiaryInfo}
                                    getFilterData={this.getFilterData}
                                    onSelectAll={this.onSelectAll}
                                    confirmApproveSelected={this.confirmApproveSelected}
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

export default Request;
