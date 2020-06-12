import React, {Component} from "react";
import {get} from 'lodash';
import clonedeep from "lodash.clonedeep";
import {Breadcrumb, Button, message, Modal, Progress, Input, Spin} from "antd";
import {Col, Row} from "reactstrap";
import {ApiService} from "../../services";
import {getDueColor, getOrphanFlags} from "../../services/constants";
import NoneGroupsList from "./NoneGroupsList";
const { TextArea } = Input


class NoneGroups extends Component {
    _apiService = new ApiService();
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            members: [],
            apps: [],
            selectedEnt: [],
            searchKey: '',
            activeKey: 108,
            comment: {
                appId: '',
                entId: '',
                text:  '',
            },
        };
    }

    componentDidMount() {
        if (this.props.certificationId) {
            this.getUserDetails(this.props.certificationId)
        }
    }

    getUserDetails = async (certificationId) => {
        this.setState({
            isLoading: true
        });
        const data = await this._apiService.getCertificationCompleteDetails(certificationId)
        if (!data && data.error) {
            this.setState({
                isLoading: false,
                apps: [],
                userDetails: {}
            });
            return message.error('something is wrong! please try again');
        } else {
            let newApps = [];
            data.forEach((d, index) => {
                d.userDetails.entityAppinstance.forEach((app, i) => {
                    (app.entityEntitlements || []).forEach((ent) => {
                        ent.prevAction = ent.action ? ent.action : 'required';
                        ent.action = ent.action ? ent.action : 'required';
                        newApps.push({
                            ...d,
                            userInfo: d.userDetails.userInfo,
                            applicationProfile: app.applicationProfile,
                            applicationInfo: app.applicationInfo,
                            accountId: app.accountId,
                            appId: i,
                            id: index,
                            entInfo: ent,
                            ...getOrphanFlags(app.applicationProfile)
                        });
                    });
                });
            });
            newApps = newApps.map((x, i) => ({...x, mainId: i}));

            this.setState({
                userDetails: data,
                apps: newApps,
                backApps: data,
                members: [{name: 108}],
                isLoading: false
            });
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
                return (x.userInfo.FirstName.toLowerCase().includes(searchKey.toLowerCase()) || x.userInfo.LastName.toLowerCase().includes(searchKey.toLowerCase())) || x.accountId.toLowerCase().includes(searchKey.toLowerCase())
            });
        }

        return filteredData;
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

    undoDecisionEnt = (index) => {
        const {apps} = this.state;
        if (apps[index] && apps[index].entInfo) {
            apps[index].entInfo.action = apps[index].entInfo.prevAction;
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

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value,
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

    submitData = async () => {
        const {apps, certificate, userDetails} = this.state;
        const userName = userDetails && userDetails.userDetails && userDetails.userDetails.userInfo && userDetails.userDetails.userInfo.UserName;

        const objPayload = {
            userName: userName,
            campaignId: "",
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
        const { groupBy, onChange, certificateActionInfo, dueDays } = this.props
        const { isLoading, members, apps, activeKey, selectedEnt, searchKey } = this.state
        const changedCount = this.getChangedCount();
        return(
            <div>
                <div className="user-detail-page">
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
                        <NoneGroupsList
                            members={members || []}
                            apps={apps || []}
                            activeKey={activeKey || ""}
                            isLoading={isLoading}
                            selectedEnt={selectedEnt || []}
                            searchKey={searchKey}
                            groupBy={groupBy}
                            changedCount={changedCount}
                            onGroupChange={onChange}
                            entCheckBoxChange={this.entCheckBoxChange}
                            undoDecisionEnt={this.undoDecisionEnt}
                            onUpdateEntStatus={this.onUpdateEntStatus}
                            onToggleComment={this.onToggleComment}
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

export default NoneGroups
