import React, {Component} from 'react';
import {Button, Checkbox, Dropdown, Icon, Input, Menu, Select, Spin, Table, Tooltip} from "antd";
import {get} from 'lodash';
import {Card, CardBody, Col, Row} from "reactstrap";
import CardHeader from "reactstrap/es/CardHeader";
import './CertificaitonOwner.scss'

const {Search} = Input;
const {Option} = Select;

class ApplicationAndEntitlements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expendedRows: []
    };
  }

  tab = () => {
    const {
      isLoadingUser, selectedEnt, entCheckBoxChange, undoDecisionEnt, onUpdateEntStatus, onToggleComment, getFilterData
    } = this.props;
    const columns = [
      {
        title: '',
        width: 30,
        render: (record) => {
          return (
            <div>
              <Checkbox className={'custom-check-box pl-10'} checked={selectedEnt.includes(record.mainId)}
                        onChange={(e) => entCheckBoxChange(record.mainId, e)}/>
            </div>
          )
        }
      },
      {
        title: 'First Name',
        render: (record) => {
            return (<span>
              {
                (record.isOrphanAccount) ? '' : record.userDetails.userInfo.FirstName
              }
            </span>);
        }
      },
      {
        title: 'Last Name',
        render: (record) => {
            return (<span>
              {
                (record.isOrphanAccount) ? '' : record.userDetails.userInfo.LastName
              }
            </span>);
        }
      },
      {
        title: 'Identity',
        render: (record) => {
          return (<span>
            {
              (record.isOrphanAccount) ? '' : record.userDetails.userInfo.UserName
            }
          </span>);
        }
      },
      {
        title: 'Account',
        render: (record) => {
          return (<span>
            {record.userDetails.entityAppinstance[record.appId].accountId}
            { (record.isOrphanAccount) ? (
                <Tooltip title="Not Linked">
                  <Icon type="flag" theme="filled" className="color-red ml-5 cursor-pointer" style={{verticalAlign: 2}}/>
                </Tooltip> ): null
            }
            { (record.isMFADisabled) ? (
                <Tooltip placement="bottom" title="MFA Disabled">
                  <Icon type="info-circle" theme="filled" className="ml-5 color-orange"/>
                </Tooltip> ) : null
            }
          </span>);
        }
      },
      {
        title: 'Application',
        render: (record) => {
          return (<span>{record.userDetails.entityAppinstance[record.appId].applicationInfo.applicationName}</span>);
        }
      },
      {
        title: 'Last Login',
        render: (record) => {
          return (<span>{record.userDetails.entityAppinstance[record.appId].applicationInfo.lastLogin}</span>);
        }
      },
      {
        width: "5%",
        title: () => {
          return <div>
            <span className="mr-5"><img src={require('../../images/kapstone-logo1.png')} /></span>
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
        width: 200,
        render: (record) => {
          const menu = (
            <Menu>
              <Menu.Item><span
                className="text-primary ml-5 cursor-pointer">Certify Conditionally</span></Menu.Item>
              <Menu.Item><span
                className="text-primary ml-5 cursor-pointer"
                onClick={() => undoDecisionEnt(record.mainId)}>Undo decision</span></Menu.Item>
            </Menu>
          );
          const action = get(record, 'entInfo.action');

          return (
            <div>
              <span
                className={`mr-10 row-action-btn ${action === 'certified' ? 'text-success' : 'text-initial'}`}
                onClick={() => onUpdateEntStatus(record.mainId, action === 'certified' ? 'required' : 'certified')}>
                   {action === 'certified' ? 'Approved' : 'Approve'}
              </span>
              <span
                className={`mr-10 row-action-btn-a ${action === 'rejected' ? 'text-success' : 'text-initial'}`}
                onClick={() => onUpdateEntStatus(record.mainId, action === 'rejected' ? 'required' : 'rejected')}>
                                      {action === 'rejected' ? 'Revoked' : 'Revoke'}
                                </span>
              <Dropdown overlay={menu} trigger={['click']}>
                <Icon type="unordered-list" className='text-primary'/>
              </Dropdown>
            </div>
          )
        }
      },
      {
        title: (<div><img src={require('../../images/comment.png')}/></div>),
        width: 50,
        align: 'right',
        render: (record) => {
          return <span className='cursor-pointer'
                       onClick={() => onToggleComment(record.mainId, record.entInfo.newComment)}><a><img
            src={require('../../images/edit.png')} className="size-img"/></a></span>
        }
      },
    ];
    return (
      <div className='border-1 mt-20' style={{flex: 1}}>
        {isLoadingUser ?
          <Spin className='mt-50 custom-loading'/> :
          <Row>
            <Col md="12" sm="12" className='pl-15'>
              <div className="inner-profile-right certification-owner">
                <Table
                  columns={columns}
                  size="medium"
                  sorting={false}
                  pagination={{pageSize: 25}}
                  className={`user-profile-data no-padding-table`}
                  dataSource={getFilterData()}
                />
              </div>
            </Col>
          </Row>
        }
      </div>
    );
  }

  render() {
    const {
      members, activeKey, onSelectAll, confirmApproveSelected, apps,
      confirmRevokeSelected, onChange, selectedEnt, changedCount, submitData, searchKey, onGroupChange, groupBy
    } = this.props;
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
                          checked={(selectedEnt.length && selectedEnt.length === apps.length)}
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

                  <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                    <Search
                        size="large"
                        placeholder="Search for entitlement"
                        // style={{width: 220}}
                        className="float-right w-100-p"
                        value={searchKey}
                        name="searchKey"
                        onChange={onChange}
                    />
                  </Col>

                  <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                    <Select placeholder='Filter' className='border-0 ml-10 float-right w-100-p' size="large"
                            onChange={(value) => onChange({
                              target: {
                                name: 'filter',
                                value
                              }
                            })} /* style={{width: 220}} */>
                      <Option value="">All</Option>
                      <Option value="certified">Approved</Option>
                      <Option value="rejected">Revoked</Option>
                      <Option value="required">Undecided</Option>
                      <Option value="mustReview">Must Review</Option>
                    </Select>
                  </Col>

                  <Col lg={2} md={4} sm={4} xs={6} className="mt-5">
                    <Select placeholder='' defaultValue="" value={groupBy} size="large" onChange={(value) => onGroupChange({target: {name: 'groupBy', value}})}
                            className='border-0 ml-10 float-right w-100-p' /* style={{width: 220}} */>
                      <Option value="users">Group by Users</Option>
                      <Option value="entitlements">Group by Entitlements</Option>
                      <Option value="none">Group by None</Option>
                    </Select>
                  </Col>
                </div>

               {/* <Button className="square" size={"large"} color="primary">
                  <Checkbox
                    onChange={onSelectAll} className="custom-check-box   "
                    checked={(selectedEnt.length && selectedEnt.length === apps.length)}
                  > Select All</Checkbox></Button>
                <Button className="square ml-10" size={"large"} color="primary"
                        onClick={confirmApproveSelected}><Icon type="check"/>Approve</Button>
                <Button className="square ml-10" size={"large"} color="primary"
                        onClick={confirmRevokeSelected}><Icon type="minus-circle"/>Revoke</Button>

                <Select placeholder='Show New Access' defaultValue="" value={groupBy} size="large" onChange={(value) => onGroupChange({target: {name: 'groupBy', value}})}
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
                </Select>
                <Search
                    size="large"
                    placeholder="Search for entitlement"
                    style={{width: 220}}
                    className="float-right"
                    value={searchKey}
                    name="searchKey"
                    onChange={onChange}
                />*/}
              </Col>
            </div>
          </CardHeader>
          <CardBody className="pt-0">
            <Row>
              {
                members.map(item => {
                  if (item.name === activeKey) {
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
                disabled={changedCount === 0}
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
