import React, {Component} from "react";
import {get} from 'lodash';
import {ApiService} from "../../services";
import {
    Breadcrumb,
    Button,
    Icon,
    Input,
    message, Modal,
    Progress,
    Radio,
    Tabs
} from "antd";
import {Col, Row} from "reactstrap";
import clonedeep from "lodash.clonedeep";
import ApplicationAndEntitlements from "./ApplicationAndEntitlements";
import {getDueColor, getOrphanFlags} from '../../services/constants';

const {Search} = Input;
const {TabPane} = Tabs;
const {TextArea} = Input;

const colors = ['red', 'green', 'black', 'violet', '#a2a25d'];

const getColor = (index) => {
    const i = index % 5;
    return colors[i] ? colors[i] : colors[0];
}


class Entitlements extends Component {
    _apiService = new ApiService();

    constructor(props) {
        super(props);
        this.state = {
            members: [],
            apps: [],
            selectedEnt: [],
            searchKey: '',
            comment: {
                appId: '',
                entId: '',
                text:  '',
            },
        };
    }

    componentDidMount() {
        if (this.props.campaignId) {
            this.getCertificateUsers(this.props.campaignId)
        }
    }

    getCertificateUsers = async (campaignId) => {
        this.setState({
            isLoading: true
        });
        const data = await this._apiService.getEntitlemntsCertificationList(campaignId)
        if (!data || data.error) {
            this.setState({
                isLoading: false
            });
            return message.error('something is wrong! please try again');
        } else {
            let entilements = (data || []).map((x, i) => ({
                name: x,
                id: i + 1,
                color: getColor(i),
            }));
            const firstUserName = entilements.length > 0 ? entilements[0].name : '';
            this.setState({
                certificate: data,
                activeKey: firstUserName,
                members: entilements,
                campaignId: this.props.campaignId,
                isLoading: false,
            });
            if (firstUserName) {
                this.getUserDetails(data[0], this.props.campaignId);
            }
        }
    }

    getUserDetails = async (userName, campaignID) => {
        this.setState({
            isLoadingUser: true
        });
        const data = await this._apiService.getEntitlemntsCertificationListInfo(userName, campaignID)
        if (!data && data.error) {
            this.setState({
                isLoadingUser: false,
                apps: [],
                userDetails: {}
            });
            return message.error('something is wrong! please try again');
        } else {
            let newApps = [];
            let id = 0;
            data.forEach((d, index) => {
                d.userDetails.entityAppinstance.forEach((app, i) => {
                    const objRecord = {
                        ...d,
                        id: index,
                        appId: i
                    };
                    (app.entityEntitlements || []).forEach((ent) => {
                        ent.prevAction = ent.action ? ent.action : 'required';
                        ent.action = ent.action ? ent.action : 'required';
                        ent.entId = id;
                        objRecord.entInfo = ent;
                        newApps.push({...objRecord, ...getOrphanFlags(app.applicationProfile)});
                        id++;
                    });
                });
            });
            newApps = newApps.map((x, i) => ({...x, mainId: i}));
            this.setState({
                userDetails: data,
                apps: newApps,
                backApps: data,
                isLoadingUser: false,
                isLoading: false,
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

    undoDecisionEnt = (entId) => {
        const {apps} = this.state;
        if (apps[entId] && apps[entId].entInfo) {
            apps[entId].entInfo.action = apps[entId].entInfo.prevAction;
        }
        this.setState({
            apps
        });
    }

    onUpdateEntStatus = (index, action) => {
        const {apps} = this.state;
        const currentAction = apps[index].entInfo.action;
        apps[index].entInfo.action = (currentAction === action ? 'required' : action);
        this.setState({
            apps
        });
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

    getFilterData = () => {
        const {filter, searchKey, apps} = this.state;
        if (!filter && !searchKey) {
            return apps;
        }

        let filteredData = clonedeep(apps);

        if(filter){
            filteredData = filteredData.filter(x => {
                return x.entInfo.action === filter;
            });
        }
        if(searchKey){
            filteredData = filteredData.filter(x => {
                return (x.userDetails.userInfo.FirstName.toLowerCase().includes(searchKey.toLowerCase()) || x.userDetails.userInfo.LastName.toLowerCase().includes(searchKey.toLowerCase())) ||
                x.userDetails.entityAppinstance.some(y => y.accountId.toLowerCase().includes(searchKey.toLowerCase()))
            });
        }

        return filteredData;
    }

    onSelectAll = (e) => {
        let {apps, selectedEnt} = this.state;
        if (e.target.checked) {
            selectedEnt = apps.map((x,i) => i);
            this.setState({
                selectedEnt,
            })
        } else {
            this.setState({
                selectedEnt: [],
            })
        }
    }

    getFilteredUsers = () => {
        const {members, searchUser} = this.state;
        if (!searchUser) {
            return members;
        }
        let filteredUserData = members || [];
        filteredUserData = filteredUserData.filter(x => {
            // const name = x.userInfo && `${(x.userInfo.FirstName || '')} ${(x.userInfo.LastName || '')}`;
            const name = x && x.name;
            return name.toLowerCase().includes(searchUser.toLowerCase());
        });
        return filteredUserData;
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
        const {activeKey} = this.state;
        if (activeKey === newActiveKey && !isRefresh) {
            return;
        }
        this.getUserDetails(newActiveKey, this.props.campaignId);
        this.setState({
            activeKey: newActiveKey,
            // apps: [],
            selectedEnt: [],
            selectedCertification: []
        })
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

    onChangeSearchUser = (event) => {
        this.setState({
            searchUser: event.target.value
        })
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

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    submitData = async () => {
        const {apps, certificate, userDetails} = this.state;
        const userName = userDetails && userDetails.userDetails && userDetails.userDetails.userInfo && userDetails.userDetails.userInfo.UserName;
        // if (!certificate || !certificate.campaignId || !apps.length) {
        //     return message.error('No change has been made!');
        // }
        // if (!userName) {
        //     return message.error('No User found!');
        // }
        const objPayload = {
            userName: userName,
            campaignId: certificate.campaignId,
            entityAppinstance: []
        };
        apps.forEach(app => {
            if (app.entInfo.action !== app.entInfo.prevAction) {
                const index = objPayload.entityAppinstance.findIndex(f => f.id === app.id)
                if(index !== -1){
                    objPayload.entityAppinstance[index].userDetails.entityAppinstance.push({...app.userDetails.entityAppinstance[app.appId], entityEntitlements: [app.entInfo]})
                } else {
                    let entApp = app.userDetails.entityAppinstance[app.appId]
                    entApp.entityEntitlements = [app.entInfo]
                    const obj = {
                        ...app,
                        userDetails:{
                            ...app.userDetails,
                            entityAppinstance: [entApp]
                        }
                    }
                    objPayload.entityAppinstance.push(obj)
                }
            }
        });
        if (objPayload.entityAppinstance.length) {
            const payload = []
            objPayload.entityAppinstance.forEach(x => {
                payload.push({campaignId: this.props.campaignId, userName: x.userDetails.userInfo.UserName, entityAppinstance: x.userDetails.entityAppinstance})
            });
            const data = await ApiService.ownerCertificationEntitlementsAction(payload);
            if (!data || data.error) {
                return message.error('Something is wrong! Please try again!')
            } else {
                this.setState({
                    selectedEnt: [],
                });
                return message.success('Decision update successfully');
            }
        } else {
            return message.error('No change has been made!');
        }

    }

    render() {
        const { groupBy, onChange, certificateActionInfo, dueDays, isSidebar, onSidebarChange } = this.props
        const { members, activeKey, searchUser, backApps } = this.state
        const { userDetails } = backApps && backApps.length && backApps[0] || {}
        const { entityEntitlements } = userDetails && userDetails.entityAppinstance && userDetails.entityAppinstance.length && userDetails.entityAppinstance[0] || {}
        const entitlementDetails = entityEntitlements && entityEntitlements.length && entityEntitlements[0] || {};
        const changedCount = this.getChangedCount();
        const getIntials = (firstName, lastName) => {
            return `${(firstName || '').length ? firstName.substr(0, 1).toUpperCase() : ''}${(lastName || '').length ? lastName.substr(0, 1).toUpperCase() : ''}`
        };
        const mainRecord = (members || []).find(x => x.name === activeKey) || {};
        return(
            <div>
                <div className="user-detail-page">
                    { groupBy !== "none" && !isSidebar ?
                        <div className="text-right color-white mt-50">
                            <Icon type="right" className="fs-30 cursor-pointer color-black"
                                  onClick={() => onSidebarChange(true)}/>
                        </div> : null
                    }
                    { groupBy !== "none" && isSidebar ?
                        <div className="custom-side-bar">
                            <div className="text-right color-white mr-15">
                                <Icon type="close" className="fs-20 cursor-pointer" onClick={() => onSidebarChange(!isSidebar)}/>
                            </div>
                            <div className="user-search">
                                <Search
                                    size="small"
                                    placeholder="Search Name"
                                    value={searchUser}
                                    onChange={this.onChangeSearchUser}
                                />
                            </div>
                            <div className="inner-profile">
                                <Icon type="left" onClick={this.onPrevUser} className="profile-nav-arrow"/>
                                <Icon type="right" onClick={this.onNextUser} className="profile-nav-arrow right-arrow"/>
                                <div className="text-center overflow-hidden">
                                    <div className="initial-name-inner-profile"
                                         style={{background: mainRecord && mainRecord.color || 'red'}}>{(mainRecord && mainRecord.name || 'A').charAt(0).toUpperCase()}{(mainRecord && mainRecord.name || 'B').charAt(1).toUpperCase()}</div>
                                    <div className="UName">{mainRecord && mainRecord.name}</div>
                                    <div className="UName fs-14">
                                        <span>Type: </span><b>{entitlementDetails && entitlementDetails.entitlementInfo && entitlementDetails.entitlementInfo.entitlementType || ""}</b>
                                    </div>
                                    <div className="UName fs-14">
                                        <span>Application: </span><b>{entitlementDetails && entitlementDetails.application || ""}</b>
                                    </div>

                                    <div
                                        className="UDesignation">{mainRecord && mainRecord.userInfo && mainRecord.userInfo.Title}</div>
                                    <div
                                        className="UDesignation mb-10">{mainRecord && mainRecord.userInfo && mainRecord.userInfo.Email}</div>
                                    <div className="box-part-a">
                                        <div>
                                            <span>Risk: </span><b>{entitlementDetails && entitlementDetails.itemRisk || ""}</b>
                                        </div>
                                        <div>
                                            <span>Description: </span><b>{entitlementDetails && entitlementDetails.entitlementInfo && entitlementDetails.entitlementInfo.entitlementDescription || ""}</b>
                                        </div>
                                        <div>
                                            <span>#Account: </span><b>{backApps && backApps.length || 0}</b>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {
                                    (this.getFilteredUsers() || []).length ?
                                        <Tabs activeKey={this.state.activeKey} tabPosition={"right"}
                                              className='custom-font-size mt-20 user-tab-list'
                                              onChange={this.onChangeTab}>
                                            {
                                                (this.getFilteredUsers() || []).map((item) => {
                                                    return (
                                                        <TabPane tab={
                                                            <div className="user-list-item">
                                                   <span className="initialName mr-10"
                                                         style={{background: item.color || 'red'}}>
                                                       {getIntials(item.name.charAt(0), item.name.charAt(1))}
                                                   </span>
                                                                <span className="initial-name">
                                                   {item.name}
                                                   </span>
                                                            </div>
                                                        } key={item.name} type="card">
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
                    <div className="dashboard overflow">
                        {this.modal()}
                        {this.commentModal()}
                        <Row>
                            <Col md={6} sm={12} xs={12} className="dashboard-card mobile-width">
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
                                    <Breadcrumb.Item onClick={this.props.onBackDashboard}>Certification</Breadcrumb.Item>
                                    <Breadcrumb.Item>Applications and Entitilements</Breadcrumb.Item>
                                </Breadcrumb>
                            </Col>
                        </Row>
                        <ApplicationAndEntitlements
                            members={this.state.members}
                            apps={this.state.apps}
                            activeKey={this.state.activeKey}
                            onChangeTab={this.onChangeTab}
                            getIntiials={this.state.getIntials}
                            entCheckBoxChange={this.entCheckBoxChange}
                            showDrawer={this.showDrawer}
                            undoDecisionEnt={this.undoDecisionEnt}
                            onUpdateEntStatus={this.onUpdateEntStatus}
                            onToggleComment={this.onToggleComment}
                            isLoadingUser={this.state.isLoadingUser}
                            selectedEnt={this.state.selectedEnt}
                            searchKey={this.state.searchKey}
                            changedCount={changedCount}
                            getFilterData={this.getFilterData}
                            onSelectAll={this.onSelectAll}
                            confirmApproveSelected={this.confirmApproveSelected}
                            confirmRevokeSelected={this.confirmRevokeSelected}
                            onChange={this.onChange}
                            submitData={this.submitData}
                            groupBy={groupBy}
                            onGroupChange={onChange}
                        />
                    </div>
                </div>

            </div>
        )
    }
}


export default Entitlements
