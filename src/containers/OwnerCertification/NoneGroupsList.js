import React, {Component} from 'react';
import {Button, Checkbox, Dropdown, Icon, Input, Menu, Select, Spin, Table, Tooltip} from "antd";
import {get} from 'lodash';
import {Card, CardBody, Col, Row} from "reactstrap";
import CardHeader from "reactstrap/es/CardHeader";
import './NoneGroups.scss'
import NoneGroupExpandedRow from "./NoneGroupExpandedRow";
import MediaQuery from 'react-responsive'


const {Search} = Input;
const {Option} = Select;

class NoneGroupsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expendedRows: [],
      xsExpandedRows: []
    };
  }

  onExpandedRowsChange = (data) => {
    this.setState({
      expendedRows: data.length ? [data[data.length-1]] : [],
      selectedIndex: null,
    });
  }

  onExpandXSRow = (index) => {
    const {xsExpandedRows} = this.state
    const findIndex = xsExpandedRows.indexOf(index)
    if(findIndex === -1){
      xsExpandedRows.push(index)
    }else {
      xsExpandedRows.splice(findIndex, 1)
    }
    this.setState({xsExpandedRows})
  }

  customExpandIcon = (props) => {
    if (props.expanded) {
      return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-up" theme="filled"/>;
    } else {
      return <Icon onClick={e => props.onExpand(props.record, e)} type="caret-down" theme="filled"/>;
    }
  }

  keyRegexToLabel = (key) => {
    return (key && key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\_/g, " ").replace(/\b[a-z]/g, (x) => x.toUpperCase())) || key
  }

  xsTabView = (data, columns) => {
    const {xsExpandedRows} = this.state
    const rows = () => {
      data.forEach(record => {
        let applicationProfile = record.applicationProfile || {}
        const tags = (typeof applicationProfile.tags === "string" && JSON.parse(applicationProfile.tags)) || {}
        delete applicationProfile.tags
        if(tags){
          record.applicationProfile = { ...applicationProfile, ...tags }
        }
      })
      return data.map((record,index) => {
        const userInfo = record.userInfo || {}
        const isExpanded = xsExpandedRows.indexOf(index) !== -1
        let applicationProfile = record.applicationProfile || {}
        return (
          <tr key={index}>
            {
              columns.map((item,cIndex) => (
                <td key={cIndex}>
                  <div>
                    {typeof item.title === "function" ? item.title() : item.title || ""}
                    &nbsp;&nbsp;
                  </div>
                  {item.render(record)}
                </td>
              ))
            }
            <td onClick={() => this.onExpandXSRow(index)}>
              <div>
                <Icon type={!isExpanded ? "caret-right" : "caret-down"} theme="filled"/>
              </div>
              <div>
                {!isExpanded ? "Expand" : "Collapse"}
              </div>

              {
                isExpanded ?
                  <div>
                    <h4 className="text-left mt-4">Application Profile</h4>
                    <table>
                      <tbody>
                        <tr>
                          {
                            applicationProfile && Object.keys(applicationProfile).map((key) => (
                              <td key={key}>
                                <div>
                                  <b>{this.keyRegexToLabel(key)}: </b>
                                </div>
                                <div className="word-break">
                                  {applicationProfile[key] || "-"}
                                </div>
                              </td>
                            ))
                          }
                        </tr>
                      </tbody>
                    </table>
                    {
                      !record.isOrphanAccount ?
                        <>
                          <h4 className="text-left mt-4">User Information</h4>
                          <table>
                            <tbody>
                            <tr>
                              {
                                userInfo && Object.keys(userInfo).map((x, uIndex) => {
                                  return (
                                    <td key={uIndex.toString()}>
                                      <div>
                                        <b>{this.keyRegexToLabel(x)}: </b>
                                      </div>
                                      <div className="word-break">
                                        {userInfo[x] || "-"}
                                      </div>
                                    </td>
                                  );
                                })
                              }
                            </tr>
                            </tbody>
                          </table>
                        </> : null
                    }
                  </div>
                  : null
              }
            </td>
          </tr>
        );
      })
    }

    return (
      <div className="xs-table-view inner-profile-right certification-owner overflow">
        <table className="responsive-table user-profile-data no-padding-table">
          <tbody>
            {rows()}
          </tbody>
        </table>
      </div>
    )
  }

  tab = () => {
    const { selectedEnt, entCheckBoxChange, undoDecisionEnt, onUpdateEntStatus, onToggleComment, getFilterData } = this.props;
    const { expendedRows } = this.state
    const data = getFilterData()
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
                (record && record.isOrphanAccount) ? '' : record.userInfo.FirstName
              }
            </span>);
        }
      },
      {
        title: 'Last Name',
        render: (record) => {
            return (<span>
              {
                (record && record.isOrphanAccount) ? '' : record.userInfo.LastName
              }
            </span>);
        }
      },
      {
        title: 'Identity',
        render: (record) => {
          return (<span>
            {
              (record && record.isOrphanAccount) ? '' : record.userInfo.UserName
            }
          </span>);
        }
      },
      {
        title: 'Account',
        render: (record) => {
          return (<span>
            {record.accountId}
            { (record && record.isOrphanAccount) ? (
                <Tooltip title="Not Linked">
                  <Icon type="flag" theme="filled" className="color-red ml-5 cursor-pointer" style={{verticalAlign: 2}}/>
                </Tooltip> ): null
            }
            { (record && record.isMFADisabled) ? (
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
          return (<span>{record.applicationInfo.applicationName}</span>);
        }
      },
      {
        title: 'Entitlement',
        render: (record) => {
          return (<span>{record.entInfo && record.entInfo.entitlementInfo && record.entInfo.entitlementInfo.entitlementName}</span>);
        }
      },
      {
        title: 'Type',
        render: (record) => {
          return (<span>{record.entInfo && record.entInfo.entitlementInfo && record.entInfo.entitlementInfo.entitlementType}</span>);
        }
      },
      {
        title: 'Last Login',
        render: (record) => {
          return (<span>{record.applicationInfo.lastLogin}</span>);
        }
      },
      {
        width: "5%",
        title: (record) => {
          return <div>
            <span className="mr-5"><img src={require('../../images/kapstone-logo1.png')} /></span>
          </div>
        },
        render: (record) => {
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
      <div className='border-1 mt-20 none-group' style={{flex: 1}}>
        <MediaQuery minDeviceWidth={1000}>
          <Row>
          <Col md="12" sm="12" className='pl-15'>
            <div className="inner-profile-right certification-owner overflow">
              <Table
                  columns={columns}
                  size="medium"
                  rowKey={'mainId'}
                  sorting={false}
                  pagination={{pageSize: 25}}
                  className={`user-profile-data no-padding-table`}
                  dataSource={data}
                  expandIcon={this.customExpandIcon}
                  onExpandedRowsChange={this.onExpandedRowsChange}
                  expandedRowRender={(record) => {
                    return (
                        <div>
                          <NoneGroupExpandedRow
                              applicationProfile={record.applicationProfile || {}}
                              userInfo={record.userInfo || {}}
                              isShowUserInfo={!record.isOrphanAccount}
                          />
                        </div>
                    )
                  }}
                  expandedRowKeys={expendedRows}
              />
            </div>
          </Col>
        </Row>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={999} >
          {this.xsTabView(data, columns)}
        </MediaQuery>
      </div>
    );
  }

  render() {
    const {
      members, activeKey, onSelectAll, confirmApproveSelected, apps,
      confirmRevokeSelected, onChange, selectedEnt, changedCount, submitData, searchKey, onGroupChange, groupBy, isLoading
    } = this.props;
    return (
      <div className="custom-content">
        <Card className="mt-10">
          <CardHeader className="pl-20">
            <div className="d-flex flex-wrap top-filter" style={{margin: '0px -30px'}}>
              <Col md={12} sm={12} xs={12}>
                {/*<Row>*/}
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

                {/*</Row>*/}
                {/*<Button className="square" size={"large"} color="primary">
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
            { isLoading ?
                <div className="text-center">
                  <Spin className='mt-50'/>
                </div> : null
            }
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

export default NoneGroupsList
