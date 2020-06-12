import React, {Component} from 'react';
import {Button, Checkbox, Dropdown, Icon, Menu, Select, Spin, Table, Tooltip} from "antd";
import {Card, CardBody, Col,Row} from "reactstrap";
import CardHeader from "reactstrap/es/CardHeader";
import './ApplicationsAndEntitilements.scss'

const {Option} = Select;

class ApplicationAndEntitlements extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expendedRows: [0]
        };
    }

    onExpandedRowsChange = (data) => {
        this.setState({
            expendedRows: data
        })
    }

    tab = () => {
        const {isLoadingUser, selectedEnt, selectedApp, entCheckBoxChange, undoDecisionEnt, onUpdateEntStatus, onToggleComment, getFilterEntData, checkBoxChange, showInfoDrawer, undoDecisionApp,
            onUpdateAppStatus, CustomExpandIcon, getFilterData} = this.props;
        const expandedRowRender = (mainRecord) => {
            if(!getFilterEntData((mainRecord && mainRecord.entityEntitlements) || []).length) {
                return null;
            }
            const columns = [
                {
                    title: '',
                    width: "5%",
                    render: (record) => {
                        let entItems = [];
                        const entList = selectedEnt.find(x => x.appId === mainRecord.appId);
                        if (entList) {
                            entItems = entList.entIds || [];
                        }
                        return (
                            <div>
                                <Checkbox className={'custom-check-box'} checked={entItems.includes(record.entId)} onChange={(e) => entCheckBoxChange(record.entId, mainRecord.appId, e)}/>
                            </div>
                        )
                    }
                },

                {
                    title: 'Entitlement Name',
                    width: "25%",
                    render: (record) => {
                        return <span>{record.entitlementInfo && record.entitlementInfo.entitlementName}</span>
                    }
                },
                {
                    title: 'Description',
                    width: "30%",
                    render: (record) => {
                        return <span>{record.entitlementInfo && record.entitlementInfo.entitlementDescription}</span>
                    }
                },
                {
                    title: 'Type',
                    width: "10%",
                    render: (record) => {
                        return <span>{record.entitlementInfo && record.entitlementInfo.entitlementType}</span>
                    }
                },
                {
                    width: "5%",
                    title: () => {
                        return <div><span className="mr-5"><img src={require('../../images/kapstone-logo1.png')} /></span>
                        </div>
                    },
                    render: () => {
                        return (
                            <div>
                                <img src={require('../../images/thumbs-up.png')} className="size-img" />
                            </div>
                        );
                    }
                },
                {
                    title: 'Decision',
                    width: "17%",
                    render: (record) => {
                        const menu = (
                            <Menu>
                                <Menu.Item><span
                                    className="text-primary ml-5 cursor-pointer">Certify Conditionally</span></Menu.Item>
                                <Menu.Item><span
                                    className="text-primary ml-5 cursor-pointer"
                                    onClick={() => undoDecisionEnt(record.entId, mainRecord.appId)}>Undo decision</span></Menu.Item>
                            </Menu>
                        );
                        return (
                            <div>
                                <span
                                    className={`mr-10 row-action-btn ${record.action === 'certified' ? 'text-success' : 'text-initial'}`}
                                    onClick={() => onUpdateEntStatus(record.entId, record.action === 'certified' ? 'required' : 'certified', mainRecord.appId)}>
                                     {record.action === 'certified' ? 'Approved' : 'Approve'}
                                </span>
                                <span
                                    className={`mr-10 row-action-btn-a ${record.action === 'rejected' ? 'text-success' : 'text-initial'}`}
                                    onClick={() => onUpdateEntStatus(record.entId, record.action === 'rejected' ? 'required' : 'rejected', mainRecord.appId)}>
                                      {record.action === 'rejected' ? 'Revoked' : 'Revoke'}
                                </span>
                                <Dropdown overlay={menu} trigger={['click']}>
                                    <Icon type="unordered-list" className='text-primary'/>
                                </Dropdown>
                            </div>
                        )
                    }
                },
                {
                    title: (<div><img src={require('../../images/comment.png')} /></div>),
                    width: "5%",
                    render: (record) => {
                        return <span className='cursor-pointer' onClick={() => onToggleComment(mainRecord.appId, record && record.entId, record.newComment)}><a><img src={require('../../images/edit.png')} className="size-img" /></a></span>
                    }
                },
            ];
            return (
                <Card className="antd-table-nested">
                    <Table
                        columns={columns}
                        size="small"
                        dataSource={getFilterEntData((mainRecord && mainRecord.entityEntitlements) || [])}
                        pagination={{pageSize: 5}}
                    />
                </Card>
            );
        };
        const columns = [
            {
                title: '',
                width: 10,
                render: (record) => {
                    return (
                        <div>
                            <Checkbox checked={selectedApp.includes(record.appId)} className={'custom-check-box'}
                                      onChange={() => checkBoxChange(record.appId)}/>
                        </div>
                    )
                }
            },
            {
                title: 'Application',
                width: "25%",
                render: (record) => {
                    return <span><span
                        className='application'>Application:</span> <b>{record && record.applicationInfo && record.applicationInfo.applicationName}</b>
                        <Icon type="info-circle" theme="twoTone"
                              onClick={() => showInfoDrawer(record, 'app')}/></span>
                }
            },
            {
                title: 'Account',
                width: "25%",
                render: (record) => {
                  return (<span><span className='application'>Account:</span> <b>{record && record.accountId}</b>
                      { record.isOrphanAccount ? (
                          <Tooltip title="Not Linked">
                              <Icon type="flag" theme="filled" className="color-red mr-5 cursor-pointer" style={{verticalAlign: 2}}/>
                          </Tooltip> ): null
                      }
                      { record.isMFADisabled ? (
                          <Tooltip placement="bottom" title="MFA Disabled">
                              <Icon type="info-circle" theme="filled" className="mr-5 color-orange"/>
                          </Tooltip> ) : null
                      }
                      <Icon type="info-circle" theme="twoTone" onClick={() => showInfoDrawer(record)}/></span>);
                }
            },
            {
            title: 'Last Login',
            width: "25%",
            render: (record) => {
              return (<span><span className='application'>Last Login:</span> <b>{record && record.applicationInfo && record.applicationInfo.lastLogin }</b></span>);
            }
            },
            {
                title: 'Decision',
                width: '150px',
                render: (record) => {
                    const menu = (
                        <Menu>
                            <Menu.Item><span
                                className="text-primary ml-5 cursor-pointer">Certify Conditionally</span></Menu.Item>
                            <Menu.Item><span
                                className="text-primary ml-5 cursor-pointer"
                                onClick={() => undoDecisionApp(record.appId)}>Undo decision</span></Menu.Item>
                        </Menu>
                    );
                    return (
                        <div className="no-wrap">
                           <span
                               className={`mr-10 cursor-pointer row-action-btn ${record && record.action === 'certified' ? 'text-success' : 'text-initial'}`}
                               onClick={() => onUpdateAppStatus(record.appId, 'certified')}>{record.action === 'certified' ? 'Approved' : 'Approve'}</span>
                            <span
                                className={`mr-10 cursor-pointer row-action-btn-a ${record && record.action === 'rejected' ? 'text-success' : 'text-initial'}`}
                                onClick={() => onUpdateAppStatus(record.appId, 'rejected')}>{record.action === 'rejected' ? 'Revoked' : 'Revoke'}</span>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Icon type="unordered-list" className='text-primary'/>
                            </Dropdown>
                        </div>
                    )
                }
            },
        ];
        return (
            <div className='border-1 mt-20' style={{flex: 1}}>
                {isLoadingUser ?
                    <Spin className='mt-50 custom-loading'/> :
                    <Row>
                        <Col md="12" sm="12" className='pl-15'>
                            <div className="inner-profile-right">
                                <Table
                                    columns={columns}
                                    size="medium"
                                    className={`user-profile-data no-padding-table`}
                                    expandedRowRender={expandedRowRender}
                                    expandIcon={CustomExpandIcon}
                                    dataSource={getFilterData()}
                                    defaultExpandAllRows={true}
                                    pagination={{pageSize: 25}}
                                    showHeader={false}
                                    onRow={
                                        (record, index) => {
                                            if (!((record.entityEntitlements || []).length)) {
                                                return { className: 'no-ent-data'};
                                            }
                                            return {
                                                className: this.state.expendedRows.includes(index) ? 'expanded-tr' : ''
                                            };
                                        }
                                    }
                                />
                            </div>
                        </Col>
                    </Row>
                }
            </div>
        );
    }

    render() {
        const { members, activeKey, onSelectAll, selectedApp, selectedCertification,  confirmApproveSelected,
             confirmRevokeSelected, onChange,selectedEnt, changedCount, submitData, groupBy} = this.props;
        return (
            <div className="custom-content">
                <Card className="mt-10">
                    <CardHeader className="pl-20">
                        <div className="d-flex flex-wrap top-filter" style={{margin: '0px -30px'}}>
                            <Col md={12} sm={12} xs={12}>

                                <div className="d-flex flex-wrap">

                                    <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                                        <Button className="square w-100-p" size={"large"} color="primary">
                                            <Checkbox
                                                onChange={onSelectAll} className="custom-check-box   "
                                                checked={!!(selectedApp && selectedApp.length && selectedEnt && selectedEnt.length || selectedCertification && selectedCertification.length === members && members.length)}
                                            > Select All</Checkbox></Button>
                                    </Col>

                                    <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                                        <Button className="square w-100-p" size={"large"} color="primary"
                                                onClick={confirmApproveSelected}><Icon type="check"/>Approve</Button>
                                    </Col>

                                    <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                                        <Button className="square w-100-p" size={"large"} color="primary"
                                                onClick={confirmRevokeSelected}><Icon type="minus-circle"/>Revoke</Button>
                                    </Col>

                                    <Col lg={3} md={4} sm={4} xs={6} className="mt-5">
                                        <Select placeholder='Filter' className='border-0 w-100-p float-right' size="large"
                                                onChange={(value) => onChange({
                                                    target: {
                                                        name: 'filter',
                                                        value
                                                    }
                                                })} style={{width: 220}}>
                                            <Option value="">All</Option>
                                            <Option value="certified">Approved</Option>
                                            <Option value="rejected">Revoked</Option>
                                            <Option value="required">Undecided</Option>
                                            <Option value="mustReview">Must Review</Option>
                                        </Select>
                                    </Col>

                                    <Col lg={3} md={4} sm={4} xs={6} className="mt-5">
                                        <Select placeholder='' defaultValue="" value={groupBy} size="large" onChange={(value) => onChange({target: {name: 'groupBy', value}})}
                                                className='border-0 w-100-p float-right ' style={{width: 220}}>
                                            <Option value="users">Group by Application</Option>
                                            <Option value="none">Group by None</Option>
                                        </Select>
                                    </Col>

                                </div>

                                {/*<Button className="square" size={"large"} color="primary">
                                    <Checkbox
                                        onChange={onSelectAll} className="custom-check-box   "
                                        checked={!!(selectedApp && selectedApp.length && selectedEnt && selectedEnt.length || selectedCertification && selectedCertification.length === members && members.length)}
                                    > Select All</Checkbox></Button>
                                <Button className="square ml-10" size={"large"} color="primary"
                                        onClick={confirmApproveSelected}><Icon type="check"/>Approve</Button>
                                <Button className="square ml-10" size={"large"} color="primary"
                                        onClick={confirmRevokeSelected}><Icon type="minus-circle"/>Revoke</Button>

                                <Select placeholder='Show New Access' defaultValue="" value={groupBy} size="large" onChange={(value) => onChange({target: {name: 'groupBy', value}})}
                                        className='border-0 ml-10 float-right ' style={{width: 220}}>
                                    <Option value="users">Group by Users</Option>
                                    <Option value="entitlements">Group by Entitlements</Option>
                                    <Option value="none">Group by None</Option>
                                </Select>
                                <Select placeholder='Filter' className='border-0 ml-10 float-right' size="large"
                                        onChange={(value) => onChange({
                                            target: {
                                                name: 'filter',
                                                value
                                            }
                                        })} style={{width: 220}}>
                                    <Option value="">All</Option>
                                    <Option value="certified">Approved</Option>
                                    <Option value="rejected">Revoked</Option>
                                    <Option value="required">Undecided</Option>
                                </Select>*/}
                            </Col>
                        </div>
                    </CardHeader>
                    <CardBody className="pt-0">
                        <Row>
                            {
                                members.map(item => {
                                    if (item.userInfo.UserName === activeKey) {
                                        return this.tab(item)
                                    }
                                    return null;
                                })
                            }


                        </Row>
                          <div className="sticky-btn cstm-btn">
                              <Button
                                  className="icon square float-right mb-0"
                                  size={"large"} color="primary"
                                  disabled={changedCount  === 0}
                                  onClick={submitData}>
                                  Save & Review Later ({changedCount && changedCount})
                              </Button>
                          </div>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default ApplicationAndEntitlements
